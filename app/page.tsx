'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";

type Question = {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'choice' | 'multi-choice' | 'calendar';
  question: string;
  questionHe: string;
  placeholder?: string;
  placeholderHe?: string;
  options?: string[];
  optionsHe?: string[];
  hideDescription?: boolean;
  description?: string;
  descriptionHe?: string;
  noAutoAdvance?: boolean;
  multiChoiceNote?: string;
  multiChoiceNoteHe?: string;
};

const questions: Question[] = [
  {
    id: 'name',
    type: 'text',
    question: 'Name',
    questionHe: 'שם',
    placeholder: 'Type your answer here...',
    placeholderHe: 'הקלד את התשובה שלך כאן...',
    hideDescription: true
  },
  {
    id: 'age',
    type: 'choice',
    question: 'Age',
    questionHe: 'גיל',
    options: ['Under 18', '18-24', '25-34', '35-44', '45+'],
    optionsHe: ['מתחת ל-18', '18-24', '25-34', '35-44', '45+'],
    hideDescription: true
  },
  {
    id: 'gender',
    type: 'choice',
    question: 'Gender',
    questionHe: 'מגדר',
    options: ['Male', 'Female'],
    optionsHe: ['זכר', 'נקבה'],
    hideDescription: true,
    noAutoAdvance: true
  },
  {
    id: 'phone',
    type: 'phone',
    question: "What's your phone number?",
    questionHe: 'מה מספר הפלאפון שלך?',
    placeholder: '(201) 555-0123',
    placeholderHe: '050-123-4567',
    hideDescription: true
  },
  {
    id: 'main_goal',
    type: 'multi-choice',
    question: "What's your main goal?",
    questionHe: 'מה המטרה העיקרית שלך?',
    options: [
      'Build muscle & get bigger',
      'Lose fat & get lean',
      'Nutrition',
      'Get stronger & more athletic (running/hybrid)',
      'Mental'
    ],
    optionsHe: [
      'בניית שרירים וגדילה',
      'שריפת שומן והרזיה',
      'תזונה',
      'להתחזק ולהיות אתלטי יותר (ריצות/היבריד)',
      'מנטלי'
    ],
    hideDescription: true,
    multiChoiceNote: 'Select all that apply',
    multiChoiceNoteHe: 'ניתן לבחור יותר מאחד'
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
    ],
    hideDescription: true
  },
  {
    id: 'training_days',
    type: 'choice',
    question: 'How many days per week can you train?',
    questionHe: 'כמה ימים בשבוע אתה יכול להתאמן?',
    options: ['2', '3', '4', '5', '6+'],
    optionsHe: ['2', '3', '4', '5', '6+'],
    hideDescription: true
  },
  {
    id: 'equipment',
    type: 'multi-choice',
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
    ],
    hideDescription: true,
    multiChoiceNote: 'Select all that apply',
    multiChoiceNoteHe: 'ניתן לבחור יותר מאחד'
  },
  {
    id: 'injuries',
    type: 'textarea',
    question: 'Do you have any injuries or physical limitations?',
    questionHe: 'האם יש לך פציעות או מגבלות פיזיות?',
    placeholder: 'Type your answer here...',
    placeholderHe: 'הקלד את התשובה שלך כאן...',
    hideDescription: true
  },
  {
    id: 'tried_before',
    type: 'textarea',
    question: "What have you tried before that didn't work?",
    questionHe: 'מה ניסית בעבר שלא עבד?',
    placeholder: 'Type your answer here...',
    placeholderHe: 'הקלד את התשובה שלך כאן...',
    hideDescription: true
  },
  {
    id: 'investment',
    type: 'choice',
    question: 'My 1-on-1 coaching starts at $197/mo. Are you ready to invest in yourself?',
    questionHe: 'הליווי האישי שלי מתחיל ב-₪730 לחודש. האם אתה מוכן להשקיע בעצמך?',
    options: [
      "Yes, I'm ready to start",
      'I need more information first',
      'The price is out of my budget'
    ],
    optionsHe: [
      'כן, אני מוכן להתחיל',
      'אני צריך יותר מידע קודם',
      'המחיר מחוץ לתקציב שלי'
    ],
    hideDescription: true
  },
  {
    id: 'consultation_booking',
    type: 'calendar',
    question: 'Great! Let\'s schedule your free consultation call:',
    questionHe: 'מעולה! בואו נקבע שיחת ייעוץ ראשונית:',
    hideDescription: true
  },
  {
    id: 'additional_info',
    type: 'textarea',
    question: 'Anything else you want me to know?',
    questionHe: 'משהו נוסף שתרצה שאדע?',
    placeholder: 'Type your answer here...',
    placeholderHe: 'הקלד את התשובה שלך כאן...',
    description: 'Final step',
    descriptionHe: 'סיום'
  },
  {
    id: 'email',
    type: 'email',
    question: 'Drop your best email to stay in the loop:',
    questionHe: 'השאר את האימייל הטוב ביותר שלך:',
    placeholder: 'name@example.com',
    placeholderHe: 'שם@דוגמה.com',
    hideDescription: true
  }
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [multiChoices, setMultiChoices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lang, setLang] = useState<'en' | 'he'>('he');
  const [calendarBooked, setCalendarBooked] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Initialize Cal.com and listen for booking events
  useEffect(() => {
    if (currentQuestion?.type === 'calendar') {
      (async function () {
        const cal = await getCalApi({"namespace":"arik-moz-1-1"});
        cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});

        // Listen for booking success
        cal("on", {
          action: "bookingSuccessful",
          callback: (e: any) => {
            console.log("Booking successful!", e.detail);
            setCalendarBooked(true);
            // Store booking info
            setAnswers(prev => ({
              ...prev,
              consultation_booking: `Booked: ${e.detail.data.date}`
            }));
            // Auto-advance after booking
            setTimeout(() => {
              if (currentStep < questions.length - 1) {
                setCurrentStep(currentStep + 1);
                setCurrentAnswer('');
              }
            }, 1500);
          }
        });
      })();
    }
  }, [currentQuestion?.type, currentStep]);

  const handleNext = async () => {
    // Check if answer is required (only question 12 is optional)
    const isOptional = !currentQuestion.hideDescription;

    // For multi-choice, check if at least one option is selected
    if (currentQuestion.type === 'multi-choice') {
      if (multiChoices.length === 0 && !isOptional) return;
    } else if (!currentAnswer.trim() && currentQuestion.type !== 'choice' && !isOptional) {
      return;
    }

    // Store current answer before moving
    const answerValue = currentQuestion.type === 'multi-choice' ? multiChoices.join(', ') : currentAnswer;
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answerValue
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextQuestion = questions[currentStep + 1];
      const nextAnswer = newAnswers[nextQuestion.id] || '';
      setCurrentAnswer(nextAnswer);

      // If next question is multi-choice, parse the stored answer
      if (nextQuestion.type === 'multi-choice') {
        setMultiChoices(nextAnswer ? nextAnswer.split(', ') : []);
      } else {
        setMultiChoices([]);
      }
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
          alert(lang === 'he' ? 'שגיאה בשליחת הטופס' : 'Error submitting form');
        }
      } catch (error) {
        console.error(error);
        alert(lang === 'he' ? 'שגיאה בשליחת הטופס' : 'Error submitting form');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChoice = (choice: string) => {
    setCurrentAnswer(choice);
    // Store the answer immediately
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: choice
    };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentAnswer(newAnswers[questions[currentStep + 1].id] || '');
      } else {
        // Last question - submit
        handleNext();
      }
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentQuestion.type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevQuestion = questions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id] || '';
      setCurrentAnswer(prevAnswer);

      // If previous question is multi-choice, parse the stored answer
      if (prevQuestion.type === 'multi-choice') {
        setMultiChoices(prevAnswer ? prevAnswer.split(', ') : []);
      } else {
        setMultiChoices([]);
      }
    } else {
      // If on first question, go back to welcome screen
      setShowWelcome(true);
    }
  };

  const handleMultiChoiceToggle = (option: string) => {
    if (multiChoices.includes(option)) {
      setMultiChoices(multiChoices.filter(c => c !== option));
    } else {
      setMultiChoices([...multiChoices, option]);
    }
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center justify-center p-4 font-mono">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center"
        >
          <h1 className="text-3xl text-[#2b2b2b] mb-8 font-bold">
            {lang === 'he' ? 'ליווי 1:1 עם אריק' : '1:1 Coaching with Arik'}
          </h1>

          <p className="text-base text-[#868786] mb-12 leading-relaxed max-w-xl mx-auto">
            {lang === 'he'
              ? 'הליווי 1:1 הזה מיועד לאנשים רציניים לגבי המטרות שלהם. הטופס הזה נועד לעזור לי ולך כמה שיותר.'
              : 'This 1:1 coaching is for people who are serious about their goals. This form is designed to help me and you as much as possible.'
            }
          </p>

          <div className="flex flex-col gap-4 items-center justify-center mb-8">
            {lang === 'he' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setLang('he');
                  }}
                  className="px-8 py-3 bg-[#5083e1] text-black rounded font-bold text-base hover:bg-[#4a75d1] transition-colors cursor-pointer"
                >
                  התחל עכשיו
                </button>
                <span className="text-sm text-[#2b2b2b]">לחץ <strong>Enter ↵</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setLang('en');
                  }}
                  className="px-8 py-3 bg-[#5083e1] text-black rounded font-bold text-base hover:bg-[#4a75d1] transition-colors cursor-pointer"
                >
                  Start Now
                </button>
                <span className="text-sm text-[#2b2b2b]">press <strong>Enter ↵</strong></span>
              </div>
            )}
          </div>

          <p className="text-[#868786] text-sm flex items-center justify-center gap-2">
            <Clock size={16} />
            {lang === 'he' ? 'לוקח 3-5 דקות' : 'Takes 3-5 minutes'}
          </p>

          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="mt-6 text-sm text-[#868786] hover:text-[#2b2b2b] underline cursor-pointer"
          >
            {lang === 'he' ? 'English' : 'עברית'}
          </button>
        </motion.div>
      </div>
    );
  }

  // Success Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4 font-mono">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check size={48} className="text-green-500" />
          </motion.div>
          <h1 className="text-3xl mb-4 font-bold">
            {lang === 'he' ? 'תודה רבה!' : 'Thank you!'}
          </h1>
          <p className="text-lg">
            {lang === 'he'
              ? 'הטופס נשלח בהצלחה. ניצור איתך קשר בקרוב.'
              : "Form submitted successfully. We'll be in touch soon."}
          </p>
        </motion.div>
      </div>
    );
  }

  const displayQuestion = lang === 'he' ? currentQuestion.questionHe : currentQuestion.question;
  const displayOptions = lang === 'he' ? currentQuestion.optionsHe : currentQuestion.options;
  const displayPlaceholder = lang === 'he' ? currentQuestion.placeholderHe : currentQuestion.placeholder;

  // Question Screen
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-mono">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200">
        <motion.div
          className="h-full bg-[#5083e1]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="mb-6 text-[#868786] hover:text-[#2b2b2b] text-sm cursor-pointer transition-colors"
              >
                {lang === 'he' ? '← חזור אחורה' : '← Go back'}
              </button>

              {/* Question number and title */}
              <div className="mb-4">
                <span className="text-base text-[#2b2b2b] font-bold">
                  {currentStep + 1}. {displayQuestion}
                </span>
              </div>

              {/* Description (optional) */}
              {!currentQuestion.hideDescription && (
                <p className="text-sm text-[#868786] italic mb-8">
                  {lang === 'he'
                    ? currentQuestion.descriptionHe || 'תיאור (אופציונלי)'
                    : currentQuestion.description || 'Description (optional)'}
                </p>
              )}

              {/* Multi-choice note */}
              {currentQuestion.type === 'multi-choice' && (currentQuestion.multiChoiceNote || currentQuestion.multiChoiceNoteHe) && (
                <p className="text-sm text-[#868786] italic mb-4">
                  {lang === 'he' ? currentQuestion.multiChoiceNoteHe : currentQuestion.multiChoiceNote}
                </p>
              )}

              {currentQuestion.type === 'choice' ? (
                <div className="space-y-3">
                  {displayOptions?.map((option, index) => {
                    const isSelected = currentAnswer === option;
                    return (
                      <button
                        key={index}
                        onClick={() => currentQuestion.noAutoAdvance ? setCurrentAnswer(option) : handleChoice(option)}
                        className={`w-full text-left px-5 py-3 bg-white border rounded transition-all text-base group cursor-pointer ${
                          isSelected && currentQuestion.noAutoAdvance
                            ? 'border-[#5083e1] bg-[#5083e1]/10 text-[#2b2b2b]'
                            : 'border-gray-300 hover:border-[#5083e1] hover:bg-[#5083e1]/5 text-[#2b2b2b]'
                        }`}
                      >
                        <span className={`mr-3 text-sm ${isSelected && currentQuestion.noAutoAdvance ? 'text-[#5083e1]' : 'text-[#868786] group-hover:text-[#5083e1]'}`}>
                          {isSelected && currentQuestion.noAutoAdvance ? '✓' : String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : currentQuestion.type === 'multi-choice' ? (
                <div className="space-y-3">
                  {displayOptions?.map((option, index) => {
                    const isSelected = multiChoices.includes(option);
                    return (
                      <button
                        key={index}
                        onClick={() => handleMultiChoiceToggle(option)}
                        className={`w-full text-left px-5 py-3 bg-white border rounded transition-all text-base group cursor-pointer ${
                          isSelected
                            ? 'border-[#5083e1] bg-[#5083e1]/10'
                            : 'border-gray-300 hover:border-[#5083e1] hover:bg-[#5083e1]/5'
                        }`}
                      >
                        <span className={`mr-3 text-sm ${isSelected ? 'text-[#5083e1]' : 'text-[#868786] group-hover:text-[#5083e1]'}`}>
                          {isSelected ? '✓' : String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-[#2b2b2b]">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : currentQuestion.type === 'calendar' ? (
                <div className="w-full bg-white rounded-lg p-4 shadow-lg" style={{minHeight: '500px'}}>
                  <Cal
                    namespace="arik-moz-1-1"
                    calLink="arik-moz/arik-moz-1-1"
                    style={{width:"100%",height:"100%",overflow:"scroll"}}
                    config={{"layout":"month_view"}}
                  />
                  {calendarBooked && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-center">
                      {lang === 'he' ? '✓ התור נקבע בהצלחה!' : '✓ Appointment booked successfully!'}
                    </div>
                  )}
                </div>
              ) : currentQuestion.type === 'textarea' ? (
                <>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder={displayPlaceholder}
                    className="w-full bg-transparent border-b border-gray-300 py-2 text-[#2b2b2b] text-lg placeholder-gray-300 focus:outline-none focus:border-[#5083e1] transition-colors resize-none"
                    rows={1}
                    autoFocus
                  />
                </>
              ) : (
                <input
                  type={currentQuestion.type}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={displayPlaceholder}
                  className="w-full bg-transparent border-b border-gray-300 py-2 text-[#2b2b2b] text-lg placeholder-gray-300 focus:outline-none focus:border-[#5083e1] transition-colors"
                  autoFocus
                />
              )}

              {currentQuestion.type !== 'choice' && currentQuestion.type !== 'multi-choice' && currentQuestion.type !== 'calendar' && !isSubmitting && (
                <div className="mt-8 text-sm text-[#2b2b2b] hidden md:block">
                  {lang === 'he' ? (
                    <>לחץ <strong>Enter ↵</strong></>
                  ) : (
                    <>press <strong>Enter ↵</strong></>
                  )}
                </div>
              )}

              {currentQuestion.type !== 'choice' && currentQuestion.type !== 'multi-choice' && currentStep === questions.length - 1 && (
                <div className="mt-4 text-xs text-[#868786]">
                  {lang === 'he' ? 'Shift + Enter ליצירת שורה חדשה' : 'Shift + Enter to make a line break'}
                </div>
              )}

              {/* Next Button - Hide for calendar and auto-advance choice questions */}
              {currentQuestion.type !== 'calendar' && !(currentQuestion.type === 'choice' && !currentQuestion.noAutoAdvance) && (
                <div className="mt-8">
                  <button
                    onClick={handleNext}
                    disabled={
                      isSubmitting ||
                      (currentQuestion.type === 'multi-choice' && multiChoices.length === 0 && currentQuestion.hideDescription !== false) ||
                      (currentQuestion.type === 'choice' && currentQuestion.noAutoAdvance && !currentAnswer.trim() && currentQuestion.hideDescription !== false) ||
                      (currentQuestion.type !== 'choice' && currentQuestion.type !== 'multi-choice' && !currentAnswer.trim() && currentQuestion.hideDescription !== false)
                    }
                    className="px-6 py-3 bg-[#5083e1] text-black rounded font-bold text-base hover:bg-[#4a75d1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      lang === 'he' ? 'שולח...' : 'Submitting...'
                    ) : currentStep < questions.length - 1 ? (
                      lang === 'he' ? 'הבא →' : 'Next →'
                    ) : (
                      lang === 'he' ? 'שלח' : 'Submit'
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
