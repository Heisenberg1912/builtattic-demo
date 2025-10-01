import { Router } from 'express'; import Product from '../models/Product.js'; import { requireAuth, requireFirmRole } from '../rbac/guards.js';
const r=Router();
r.get('/catalog', async (req,res)=>{ const q={status:'published'}; if(req.query.firmId) q.firm=req.query.firmId; if(req.query.q) q.$text={ $search:req.query.q }; const items=await Product.find(q).limit(50).lean(); res.json({ok:true,items}); });
r.post('/firms/:firmId/products', requireAuth, requireFirmRole('owner','admin'), async (req,res)=>{ const doc=await Product.create({...req.body, firm:req.params.firmId, status:'draft'}); res.json({ok:true,product:doc}); });
r.patch('/firms/:firmId/products/:id', requireAuth, requireFirmRole('owner','admin','associate'), async (req,res)=>{ const doc=await Product.findOneAndUpdate({_id:req.params.id, firm:req.params.firmId}, req.body, {new:true}); res.json({ok:true,product:doc}); });
r.post('/firms/:firmId/products/:id/publish', requireAuth, requireFirmRole('owner','admin'), async (req,res)=>{ const doc=await Product.findOneAndUpdate({_id:req.params.id, firm:req.params.firmId}, {status:'published'}, {new:true}); res.json({ok:true,product:doc}); });
export default r;
