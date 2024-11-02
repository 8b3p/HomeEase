import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import prisma from '@utils/PrismaClient';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Update user with reset token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expiry,
      },
    });

    // Create the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/resetpassword?token=${token}&email=${encodeURIComponent(email)}`;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. The link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

