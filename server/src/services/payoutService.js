import Payout from '../models/Payout.js';
export async function createPayoutsForOrder(order){ for(const it of order.items){ const commissionPct=10; const gross=it.lineTotal??(it.qty*it.unitPrice); const commission=(gross*commissionPct)/100; await Payout.create({ firm:it.firm, order:order._id, amountGross:gross, commissionPct, commissionAmount:commission, amountNet:gross-commission }); } }
