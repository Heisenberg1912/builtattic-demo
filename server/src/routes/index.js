import { Router } from 'express';
import authRoutes from './authRoutes.js';
import authOtpRoutes from './authOtpRoutes.js';
import userRoutes from './userRoutes.js';
import firmRoutes from './firmRoutes.js';
import clientRoutes from './clientRoutes.js';
import leadRoutes from './leadRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import activityLogRoutes from './activityLogRoutes.js';

import orderOTPRoutes from './orderOTPRoutes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/auth-otp', authOtpRoutes);
router.use('/users', userRoutes);
router.use('/firms', firmRoutes);
router.use('/clients', clientRoutes);
router.use('/sales/leads', leadRoutes);
router.use('/bookings', bookingRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/tickets', ticketRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/orders-otp', orderOTPRoutes);
export default router;
