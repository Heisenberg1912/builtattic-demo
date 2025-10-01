import { Router } from 'express';
import argon2 from 'argon2';
import User from '../models/User.js';
import { signAccess } from '../auth/middleware.js';
import { requireAuth } from '../rbac/guards.js';

const r = Router();

/**
 * POST /auth/signup
 * body: { email, password }
 * returns: { ok, token, user }
 */
r.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};
  const emailNorm = (email || '').trim().toLowerCase();

  if (!emailNorm || !password) {
    return res.status(400).json({ ok: false, error: 'email & password required' });
  }

  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(409).json({ ok: false, error: 'email exists' });

  const passHash = await argon2.hash(password);
  const u = await User.create({ email: emailNorm, passHash, rolesGlobal: [] });

  const user = {
    _id: u._id,
    email: u.email,
    rolesGlobal: u.rolesGlobal || [],
    memberships: u.memberships || [],
  };
  const token = signAccess(u);
  return res.json({ ok: true, token, user });
});

/**
 * POST /auth/login
 * body: { email, password }
 * returns: { ok, token, user }
 */
r.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const emailNorm = (email || '').trim().toLowerCase();

  const u = await User.findOne({ email: emailNorm });
  if (!u) return res.status(401).json({ ok: false, error: 'invalid credentials' });

  const ok = await argon2.verify(u.passHash, password || '');
  if (!ok) return res.status(401).json({ ok: false, error: 'invalid credentials' });

  // Fresh user snapshot (no passHash)
  const fresh = await User.findById(u._id)
    .select('email rolesGlobal memberships')
    .lean();

  const token = signAccess({ ...u.toObject(), ...fresh });
  return res.json({
    ok: true,
    token,
    user: {
      _id: u._id,
      email: fresh.email,
      rolesGlobal: fresh.rolesGlobal || [],
      memberships: fresh.memberships || [],
    },
  });
});

/**
 * GET /auth/me
 * headers: Authorization: Bearer <token>
 * returns: { ok, user }
 * (Helpful to debug which user/roles the token currently has)
 */
r.get('/me', requireAuth, async (req, res) => {
  const fresh = await User.findById(req.user._id)
    .select('email rolesGlobal memberships')
    .lean();

  if (!fresh) return res.status(404).json({ ok: false, error: 'user not found' });

  return res.json({
    ok: true,
    user: {
      _id: req.user._id,
      email: fresh.email,
      rolesGlobal: fresh.rolesGlobal || [],
      memberships: fresh.memberships || [],
    },
  });
});

export default r;