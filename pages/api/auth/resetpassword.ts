import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@utils/PrismaClient';
import { hashPassword } from '@utils/passwordCrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, email, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.resetPasswordToken !== token || !user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const { hashedPassword, salt } = hashPassword(newPassword);

    // Update the user's password and clear the reset token fields
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        salt: salt,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

