import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import ReminderEmail from "@/tasks/email/emailTemplate"; // adjust path if needed

function getSubject(type: string): string {
  switch (type) {
    case 'REMINDER':
      return 'Upcoming Appointment Reminder';
    case 'FOLLOW_UP':
      return 'We Hope Your Appointment Went Well!';
    case 'CANCELLATION':
      return 'Appointment Cancellation Confirmation';
    case 'MISSED':
      return 'You Missed Your Appointment';
    case 'CUSTOM':
      return 'Custom Notification Regarding Your Appointment';
    default:
      return 'Appointment Notification';
  }
}

export async function sendReminderEmail(
  email: string,
  name: string,
  message: string,
  type: string
) {

  const html = await render(<ReminderEmail name={name} message={message} />);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Neutroline Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: getSubject(type),
    html,
  });
  console.log('email success');
  return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
}
