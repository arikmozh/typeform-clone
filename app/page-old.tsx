'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock } from 'lucide-react';

type Question = {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'choice';
  question: string;
  questionHe: string;
  placeholder?: string;
  options?: string[];
  optionsHe?: string[];
};

const questions: Question[] = [
  {
    id: 'name',
    type: 'text',
    question: 'Name',
    questionHe: 'שם',
    placeholder: 'Type your answer here...'
  },
  {
    id: 'age',
    type: 'choice',
    question: 'Age',
    questionHe: 'גיל',
    options: ['Under 18', '18-24', '25-34', '35-44', '45+'],
    optionsHe: ['מתחת ל-18', '18-24', '25-34', '35-44', '45+']
  },
  {
    id: 'gender',
    type: 'choice',
    question: 'Gender',
    questionHe: 'מגדר',
    options: ['Male', 'Female', 'Prefer not to say'],
    optionsHe: ['זכר', 'נקבה', 'מעדיף/ה לא לומר']
  },
  {
    id: 'phone',
    type: 'phone',
    question: 'What is the best phone number to contact you regarding your interest in Instagram coaching?',
    questionHe: 'מה מספר הטלפון הטוב ביותר ליצירת קשר בנוגע לעניין שלך באימון?',
    placeholder: '(201) 555-0123'
  },
  {
    id: 'main_goal',
    type: 'choice',
    question: "What's your main goal?",
    questionHe: 'מה המטרה העיקרית שלך?',
    options: [
      'Build muscle & get bigger',
      'Lose fat & get lean',
      'Both - recomposition',
      'Get stronger & more athletic',
      'General health & fitness'
    ],
    optionsHe: [
      'בניית שרירים וגדילה',
      'שריפת שומן והתרזה',
      'שניהם - ריקומפוזיציה',
      'להתחזק ולהיות אתלטי יותר',
      'בריאות וכושר כללי'
    ]
  },
  {
    id: 'training_experience',
    type: 'choice',
    question: "What's your current training experience?",
    questionHe: 'מה ניסיון האימון הנוכחי שלך?',
    options: [
      'Complete beginner (0-6 months)',
      'Intermediate (6 months-2 years)',
      'Advanced (2+ years)'
    ],
    optionsHe: [
      'מתחיל לחלוטין (0-6 חודשים)',
      'בינוני (6 חודשים-2 שנים)',
      'מתקדם (2+ שנים)'
    ]
  },
  {
    id: 'training_days',
    type: 'choice',
    question: 'How many days per week can you train?',
    questionHe: 'כמה ימים בשבוע אתה יכול להתאמן?',
    options: ['2', '3', '4', '5', '6+'],
    optionsHe: ['2', '3', '4', '5', '6+']
  },
  {
    id: 'equipment',
    type: 'choice',
    question: 'What equipment do you have access to?',
    questionHe: 'לאיזה ציוד יש לך גישה?',
    options: [
      'Full gym',
      'Home gym / dumbbells',
      'Bodyweight only',
      'Jump rope',
      'Resistance bands'
    ],
    optionsHe: [
      'חדר כושר מלא',
      'חדר כושר ביתי / משקולות',
      'משקל גוף בלבד',
      'חבל קפיצה',
      'רצועות התנגדות'
    ]
  },
  {
    id: 'injuries',
    type: 'textarea',
    question: 'Do you have any injuries or physical limitations?',
    questionHe: 'האם יש לך פציעות או מגבלות פיזיות?',
    placeholder: 'Type your answer here...'
  },
  {
    id: 'tried_before',
    type: 'textarea',
    question: "What have you tried before that didn't work?",
    questionHe: 'מה ניסית בעבר שלא עבד?',
    placeholder: 'Type your answer here...'
  },
  {
    id: 'investment',
    type: 'choice',
    question: 'My 1-on-1 coaching starts at $197/mo. Are you ready to invest in yourself?',
    questionHe: 'האימון האישי שלי מתחיל ב-$197 לחודש. האם אתה מוכן להשקיע בעצמך?',
    options: [
      "Yes, I'm ready to start",
      'I need more information first',
      'The price is out of my budget'
    ],
    optionsHe: [
      'כן, אני מוכן להתחיל',
      'אני צריך יותר מידע קודם',
      'המחיר מחוץ לתקציב שלי'
    ]
  },
  {
    id: 'additional_info',
    type: 'textarea',
    question: 'Anything else you want me to know?',
    questionHe: 'משהו נוסף שתרצה שאדע?',
    placeholder: 'Type your answer here...'
  },
  {
    id: 'email',
    type: 'email',
    question: 'Drop your best email to stay in the loop:',
    questionHe: 'השאר את האימייל הטוב ביותר שלך:',
    placeholder: 'name@example.com'
  }
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lang, setLang] = useState<'en' | 'he'>('he'); // Default to Hebrew

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentAnswer('');
    } else {
      // Submit form
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers)
        });

        if (response.ok) {
          setIsComplete(true);
        } else {
          alert('שגיאה בשליחת הטופס');
        }
      } catch (error) {
        console.error(error);
        alert('שגיאה בשליחת הטופס');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentQuestion.type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check size={48} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">תודה רבה!</h1>
          <p className="text-xl">הטופס נשלח בהצלחה. ניצור איתך קשר בקרוב.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              <div className="mb-8">
                <span className="text-sm opacity-60">
                  שאלה {currentStep + 1} מתוך {questions.length}
                </span>
              </div>

              <h2 className="text-4xl font-bold mb-8 leading-tight">
                {currentQuestion.question}
              </h2>

              {currentQuestion.type === 'textarea' ? (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQuestion.placeholder}
                  className="w-full bg-white/10 border-2 border-white/30 rounded-lg px-6 py-4 text-white text-xl placeholder-white/50 focus:outline-none focus:border-white transition-colors resize-none"
                  rows={4}
                  autoFocus
                />
              ) : (
                <input
                  type={currentQuestion.type}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQuestion.placeholder}
                  className="w-full bg-white/10 border-2 border-white/30 rounded-lg px-6 py-4 text-white text-xl placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  autoFocus
                  dir="rtl"
                />
              )}

              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim() || isSubmitting}
                className="mt-6 bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  'שולח...'
                ) : currentStep < questions.length - 1 ? (
                  <>
                    הבא
                    <ArrowRight size={20} />
                  </>
                ) : (
                  <>
                    שלח
                    <Check size={20} />
                  </>
                )}
              </button>

              <div className="mt-4 text-sm opacity-60">
                לחץ Enter או לחץ על כפתור &quot;הבא&quot;
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
