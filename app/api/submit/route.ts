import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'mozharovskyarik@gmail.com';

export async function POST(req: Request) {
  try {
    const answers = await req.json();

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('leads').insert({
      name: answers.name,
      phone: answers.phone,
      email: answers.email || null,
      main_goal: answers.goal,
      answers: answers,
    });

    if (error) {
      console.error('Error saving lead:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification for new lead
    try {
      await resend.emails.send({
        from: 'Leads <onboarding@resend.dev>',
        to: NOTIFY_EMAIL,
        subject: `🔥 ליד חדש: ${answers.name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #E05A00; margin-bottom: 20px;">ליד חדש נכנס! 🔥</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">שם</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${answers.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">טלפון</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; direction: ltr; text-align: right;">
                  <a href="tel:${answers.phone}" style="color: #E05A00;">${answers.phone}</a>
                </td>
              </tr>
              ${answers.email ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">אימייל</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="mailto:${answers.email}" style="color: #E05A00;">${answers.email}</a>
                </td>
              </tr>
              ` : ''}
              ${answers.goal ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">מטרה</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${answers.goal}</td>
              </tr>
              ` : ''}
            </table>
            <p style="margin-top: 20px; color: #888; font-size: 13px;">
              ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
