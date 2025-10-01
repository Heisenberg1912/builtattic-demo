import { Router } from 'express'; import Firm from '../models/Firm.js'; import { requireAuth, requireGlobal } from '../rbac/guards.js';
const r=Router();
r.get('/admin/vendors', requireAuth, requireGlobal('admin','superadmin'), async (_req,res)=>{ const firms=await Firm.find({}).limit(100).lean(); res.json({ok:true,firms}); });
r.patch('/admin/vendors/:id/approve', requireAuth, requireGlobal('admin','superadmin'), async (req,res)=>{ const firm=await Firm.findByIdAndUpdate(req.params.id,{approved:true},{new:true}); res.json({ok:true,firm}); });
export default r;
