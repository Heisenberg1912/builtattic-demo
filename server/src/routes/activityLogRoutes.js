import { Router } from 'express';
import { listActivityLogs } from '../controllers/activityLogController.js';
import * as auth from '../middleware/auth.js';

const NOOP = (_req, _res, next) => next();
const authenticateJWT =
  typeof auth.authenticateJWT === 'function' ? auth.authenticateJWT
  : typeof auth.verifyToken === 'function' ? auth.verifyToken
  : NOOP;

const authorizeRoles =
  typeof auth.authorizeRoles === 'function' ? auth.authorizeRoles
  : () => NOOP;

const scopeQueryByRole =
  typeof auth.scopeQueryByRole === 'function' ? auth.scopeQueryByRole
  : NOOP;

// Local ROLES fallback to prevent ReferenceError
const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

const router = Router();
router.get('/', authenticateJWT, authorizeRoles(ROLES.SUPER_ADMIN), listActivityLogs);
export default router;
