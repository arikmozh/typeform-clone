import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const answers = await req.json();

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('leads').insert({
      // Basic Info
      name: answers.name,
      age: answers.age,
      gender: answers.gender,
      phone: answers.phone,
      email: answers.email,

      // Context
      why_now: answers.why_now,
      real_reason: answers.real_reason,

      // Fitness Goals
      main_goal: answers.main_goal,
      main_blocker: answers.main_blocker,
      training_experience: answers.training_experience,
      training_days: answers.training_days,

      // Health & History
      injuries: answers.injuries,
      tried_before: answers.tried_before,

      // Preference & Investment
      format_preference: answers.format_preference,
      investment: answers.investment,

      // Complete answers as JSON for backup
      answers: answers
    });

    if (error) {
      console.error('Error saving lead:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
