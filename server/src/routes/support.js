import { Router } from 'express';
import {
  getThread,
  ingestEmailReply,
  postChatMessage,
} from '../controllers/supportController.js';

const router = Router();

router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

router.post('/chat', postChatMessage);
router.get('/chat/:threadId', getThread);
router.post('/chat/inbound', ingestEmailReply);

export default router;
