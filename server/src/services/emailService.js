import nodemailer from 'nodemailer';
let transporter; export function getTransporter(){ if(transporter) return transporter; transporter=nodemailer.createTransport({ host:process.env.EMAIL_HOST, port:Number(process.env.EMAIL_PORT||587), secure:false, auth:process.env.EMAIL_USER?{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}:undefined }); return transporter; }
export async function sendMail({to,subject,text,html}){ const tx=getTransporter(); const from=process.env.EMAIL_FROM||'no-reply@builtattic.com'; return tx.sendMail({from,to,subject,text,html}); }
