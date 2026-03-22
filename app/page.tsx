"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Clock, Sun, Moon } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";

type Question = {
  id: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "textarea"
    | "choice"
    | "multi-choice"
    | "calendar";
  question: string;
  questionHe: string;
  questionHeMale?: string;
  questionHeFemale?: string;
  placeholder?: string;
  placeholderHe?: string;
  placeholderHeMale?: string;
  placeholderHeFemale?: string;
  options?: string[];
  optionsHe?: string[];
  optionsFemale?: string[];
  optionsFemaleHe?: string[];
  optionsHeMale?: string[];
  optionsHeFemale?: string[];
  hideDescription?: boolean;
  description?: string;
  descriptionHe?: string;
  noAutoAdvance?: boolean;
  multiChoiceNote?: string;
  multiChoiceNoteHe?: string;
};

const questions: Question[] = [
  {
    id: "name",
    type: "text",
    question: "Name",
    questionHe: "שם",
    placeholder: "Type your answer here...",
    placeholderHe: "הקלד את התשובה שלך כאן...",
    hideDescription: true,
  },
  {
    id: "age",
    type: "choice",
    question: "Age",
    questionHe: "גיל",
    options: ["Under 18", "18-24", "25-34", "35-44", "45+"],
    optionsHe: ["מתחת ל-18", "18-24", "25-34", "35-44", "45+"],
    hideDescription: true,
  },
  {
    id: "gender",
    type: "choice",
    question: "Gender",
    questionHe: "מגדר",
    options: ["Male", "Female"],
    optionsHe: ["זכר", "נקבה"],
    hideDescription: true,
  },
  {
    id: "phone",
    type: "phone",
    question: "What's your phone number?",
    questionHe: "מה מספר הפלאפון שלך?",
    questionHeMale: "מה מספר הפלאפון שלך?",
    questionHeFemale: "מה מספר הפלאפון שלך?",
    placeholder: "(201) 555-0123",
    placeholderHe: "050-123-4567",
    hideDescription: true,
  },
  {
    id: "why_now",
    type: "multi-choice",
    question: "What made you reach out now?",
    questionHe: "מה גרם לך לפנות עכשיו?",
    options: [
      "Something changed in my life",
      "I'm tired of my current situation",
      "I want to improve my performance",
      "Health / doctor's recommendation",
      "Wedding / upcoming event",
    ],
    optionsHe: [
      "משהו השתנה בחיים שלי",
      "נמאס לי מהמצב",
      "רוצה לשפר ביצועים",
      "בריאות / המלצת רופא",
      "חתונה / אירוע קרוב",
    ],
    hideDescription: true,
    multiChoiceNote: "Select all that apply",
    multiChoiceNoteHe: "ניתן לבחור יותר מאחד",
  },
  {
    id: "main_goal",
    type: "multi-choice",
    question: "What's your main goal?",
    questionHe: "מה המטרה העיקרית שלך?",
    options: [
      "Build muscle & get bigger",
      "Lose fat & get lean",
      "Nutrition",
      "Get stronger & more athletic (running/hybrid)",
      "Mental",
    ],
    optionsHe: [
      "בניית שרירים וגדילה",
      "שריפת שומן והרזיה",
      "תזונה",
      "להתחזק ולהיות אתלטי יותר (ריצות/היבריד)",
      "מנטלי",
    ],
    // Female-specific options
    optionsFemale: [
      "Tone & strengthen glutes",
      "Lose fat & get lean",
      "Nutrition",
      "Improve flexibility & balance",
      "Mental",
    ],
    optionsFemaleHe: [
      "חיטוב ומיצוק הישבן",
      "שריפת שומן והרזיה",
      "תזונה",
      "שיפור גמישות ושיווי משקל",
      "מנטלי",
    ],
    hideDescription: true,
    multiChoiceNote: "Select all that apply",
    multiChoiceNoteHe: "ניתן לבחור יותר מאחד",
  },
  {
    id: "main_blocker",
    type: "choice",
    question: "What's the biggest thing holding you back?",
    questionHe: "מה הדבר הכי גדול שמעכב אותך?",
    options: [
      "No time",
      "Lack of motivation",
      "Don't know where to start",
      "Inconsistent nutrition",
      "Keep falling off track",
    ],
    optionsHe: [
      "אין לי זמן",
      "חוסר מוטיבציה",
      "לא יודע מאיפה להתחיל",
      "תזונה לא מסודרת",
      "נפילות חוזרות",
    ],
    hideDescription: true,
  },
  {
    id: "training_experience",
    type: "choice",
    question: "What's your current training experience?",
    questionHe: "מה ניסיון האימון הנוכחי שלך?",
    questionHeMale: "מה ניסיון האימון הנוכחי שלך?",
    questionHeFemale: "מה ניסיון האימון הנוכחי שלך?",
    options: [
      "Complete beginner (0-6 months)",
      "Intermediate (6 months-2 years)",
      "Advanced (2+ years)",
    ],
    optionsHe: [
      "מתחיל לחלוטין (0-6 חודשים)",
      "בינוני (6 חודשים-2 שנים)",
      "מתקדם (2+ שנים)",
    ],
    optionsHeMale: [
      "מתחיל לחלוטין (0-6 חודשים)",
      "בינוני (6 חודשים-2 שנים)",
      "מתקדם (2+ שנים)",
    ],
    optionsHeFemale: [
      "מתחילה לחלוטין (0-6 חודשים)",
      "בינונית (6 חודשים-2 שנים)",
      "מתקדמת (2+ שנים)",
    ],
    hideDescription: true,
  },
  {
    id: "training_days",
    type: "choice",
    question: "How many days per week can you train?",
    questionHe: "כמה ימים בשבוע אתה יכול להתאמן?",
    questionHeMale: "כמה ימים בשבוע אתה יכול להתאמן?",
    questionHeFemale: "כמה ימים בשבוע את יכולה להתאמן?",
    options: ["2", "3", "4", "5", "6+"],
    optionsHe: ["2", "3", "4", "5", "6+"],
    hideDescription: true,
  },
  {
    id: "daily_training_time",
    type: "choice",
    question: "How much time do you have for training/movement per day?",
    questionHe: "כמה זמן יש לך לאימון/תנועה ביום?",
    questionHeMale: "כמה זמן יש לך לאימון/תנועה ביום?",
    questionHeFemale: "כמה זמן יש לך לאימון/תנועה ביום?",
    options: ["10 minutes", "30 minutes", "1 hour", "More than 1 hour"],
    optionsHe: ["10 דקות", "30 דקות", "שעה", "יותר משעה"],
    hideDescription: true,
  },
  {
    id: "diet",
    type: "choice",
    question: "How is your diet?",
    questionHe: "איך התזונה שלך?",
    questionHeMale: "איך התזונה שלך?",
    questionHeFemale: "איך התזונה שלך?",
    options: ["Vegetarian", "Vegan", "No restrictions"],
    optionsHe: ["צמחוני", "טבעוני", "לא בעייתי"],
    optionsHeMale: ["צמחוני", "טבעוני", "לא בעייתי"],
    optionsHeFemale: ["צמחונית", "טבעונית", "לא בעייתי"],
    hideDescription: true,
  },
  {
    id: "equipment",
    type: "multi-choice",
    question: "What equipment do you have access to?",
    questionHe: "לאיזה ציוד יש לך גישה?",
    options: [
      "Full gym",
      "Home gym / dumbbells",
      "Bodyweight only",
      "Jump rope",
      "Resistance bands",
    ],
    optionsHe: [
      "חדר כושר מלא",
      "חדר כושר ביתי / משקולות",
      "משקל גוף בלבד",
      "חבל קפיצה",
      "רצועות התנגדות",
    ],
    hideDescription: true,
    multiChoiceNote: "Select all that apply",
    multiChoiceNoteHe: "ניתן לבחור יותר מאחד",
  },
  {
    id: "injuries",
    type: "textarea",
    question: "Do you have any injuries or physical limitations?",
    questionHe: "האם יש לך פציעות או מגבלות פיזיות?",
    questionHeMale: "האם יש לך פציעות או מגבלות פיזיות?",
    questionHeFemale: "האם יש לך פציעות או מגבלות פיזיות?",
    placeholder: "Type your answer here...",
    placeholderHe: "הקלד את התשובה שלך כאן...",
    placeholderHeMale: "הקלד את התשובה שלך כאן...",
    placeholderHeFemale: "הקלידי את התשובה שלך כאן...",
    hideDescription: true,
  },
  {
    id: "tried_before",
    type: "textarea",
    question: "What have you tried before that didn't work?",
    questionHe: "מה ניסית בעבר שלא עבד?",
    questionHeMale: "מה ניסית בעבר שלא עבד?",
    questionHeFemale: "מה ניסית בעבר שלא עבד?",
    placeholder: "Type your answer here...",
    placeholderHe: "הקלד את התשובה שלך כאן...",
    placeholderHeMale: "הקלד את התשובה שלך כאן...",
    placeholderHeFemale: "הקלידי את התשובה שלך כאן...",
    hideDescription: true,
  },
  {
    id: "format_preference",
    type: "choice",
    question: "What works best for you?",
    questionHe: "מה מתאים לך יותר?",
    questionHeMale: "מה מתאים לך יותר?",
    questionHeFemale: "מה מתאים לך יותר?",
    options: [
      "Personal 1:1 coaching with Arik",
      "Workout program / meal plan from my experience — things that actually worked on me and others over the years",
      "Not sure yet",
    ],
    optionsHe: [
      "ליווי אישי 1:1 עם אריק",
      "תוכנית אימונים / תפריט תזונה מהניסיון שלי — דברים שאשכרה עבדו עלי ועל אחרים לאורך השנים",
      "עדיין לא יודע",
    ],
    optionsHeMale: [
      "ליווי אישי 1:1 עם אריק",
      "תוכנית אימונים / תפריט תזונה מהניסיון שלי — דברים שאשכרה עבדו עלי ועל אחרים לאורך השנים",
      "עדיין לא יודע",
    ],
    optionsHeFemale: [
      "ליווי אישי 1:1 עם אריק",
      "תוכנית אימונים / תפריט תזונה מהניסיון שלי — דברים שאשכרה עבדו עלי ועל אחרים לאורך השנים",
      "עדיין לא יודעת",
    ],
    hideDescription: true,
  },
  {
    id: "investment",
    type: "choice",
    question:
      "My 1-on-1 coaching starts at $197/mo. Are you ready to invest in yourself?",
    questionHe:
      "הליווי האישי שלי מתחיל מ-₪730 לחודש. האם אתה מוכן להשקיע בעצמך?",
    questionHeMale:
      "הליווי האישי שלי מתחיל מ-₪730 לחודש. האם אתה מוכן להשקיע בעצמך?",
    questionHeFemale:
      "הליווי האישי שלי מתחיל מ-₪730 לחודש. האם את מוכנה להשקיע בעצמך?",
    options: [
      "Yes, I'm ready to start",
      "I need more information first",
      "The price is out of my budget",
    ],
    optionsHe: [
      "כן, אני מוכן להתחיל",
      "אני צריך יותר מידע קודם",
      "המחיר מחוץ לתקציב שלי",
    ],
    optionsHeMale: [
      "כן, אני מוכן להתחיל",
      "אני צריך יותר מידע קודם",
      "המחיר מחוץ לתקציב שלי",
    ],
    optionsHeFemale: [
      "כן, אני מוכנה להתחיל",
      "אני צריכה יותר מידע קודם",
      "המחיר מחוץ לתקציב שלי",
    ],
    hideDescription: true,
  },
  {
    id: "additional_info",
    type: "textarea",
    question: "Anything else you want me to know?",
    questionHe: "משהו נוסף שתרצה שאדע?",
    questionHeMale: "משהו נוסף שתרצה שאדע?",
    questionHeFemale: "משהו נוסף שתרצי שאדע?",
    placeholder: "Type your answer here...",
    placeholderHe: "הקלד את התשובה שלך כאן...",
    placeholderHeMale: "הקלד את התשובה שלך כאן...",
    placeholderHeFemale: "הקלידי את התשובה שלך כאן...",
    hideDescription: true,
  },
  {
    id: "email",
    type: "email",
    question: "Leave your best email:",
    questionHe: "השאר את האימייל הטוב ביותר שלך:",
    placeholder: "name@example.com",
    placeholderHe: "שם@דוגמה.com",
    hideDescription: true,
  },
  {
    id: "consultation_booking",
    type: "calendar",
    question: "Great! Let's schedule an initial consultation call:",
    questionHe: "מעולה! בואו נקבע שיחת ייעוץ ראשונית:",
    hideDescription: true,
  },
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [multiChoices, setMultiChoices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lang, setLang] = useState<"en" | "he">("he");
  const [calendarBooked, setCalendarBooked] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Detect system theme + prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Initialize Cal.com and listen for booking events
  useEffect(() => {
    if (currentQuestion?.type === "calendar") {
      (async function () {
        const cal = await getCalApi({ namespace: "arik-moz-1-1" });

        // Configure UI with week view and theme
        cal("ui", {
          theme: "light",
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#E05A00",
            },
            dark: {
              "cal-brand": "#E05A00",
            },
          },
          hideEventTypeDetails: false,
          layout: "week_view",
        });

        // Listen for booking success
        cal("on", {
          action: "bookingSuccessful",
          callback: async (e: any) => {
            console.log("Booking successful!", e.detail);
            setCalendarBooked(true);

            // Store booking info
            const bookingData = {
              ...answers,
              consultation_booking: `Booked: ${e.detail.data.date}`,
            };
            setAnswers(bookingData);

            // Submit to database
            try {
              await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
              });
            } catch (error) {
              console.error("Error submitting booking:", error);
            }
          },
        });
      })();
    }
  }, [currentQuestion?.type, currentStep, answers]);

  const handleNext = async () => {
    // Clear previous validation errors
    setValidationError("");

    // Check if answer is required (only question 12 is optional)
    const isOptional = !currentQuestion.hideDescription;

    // For multi-choice, check if at least one option is selected
    if (currentQuestion.type === "multi-choice") {
      if (multiChoices.length === 0 && !isOptional) return;
    } else if (
      !currentAnswer.trim() &&
      currentQuestion.type !== "choice" &&
      !isOptional
    ) {
      return;
    }

    // Validate phone number (step 4)
    if (currentQuestion.type === "phone") {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(currentAnswer) || currentAnswer.length < 9) {
        setValidationError(
          lang === "he"
            ? "אנא הזן מספר טלפון תקין"
            : "Please enter a valid phone number",
        );
        return;
      }
    }

    // Validate email (step 13)
    if (currentQuestion.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentAnswer)) {
        setValidationError(
          lang === "he"
            ? "אנא הזן כתובת אימייל תקינה"
            : "Please enter a valid email address",
        );
        return;
      }
    }

    // Store current answer before moving
    const answerValue =
      currentQuestion.type === "multi-choice"
        ? multiChoices.join(", ")
        : currentAnswer;
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answerValue,
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextQuestion = questions[currentStep + 1];
      const nextAnswer = newAnswers[nextQuestion.id] || "";
      setCurrentAnswer(nextAnswer);

      // If next question is multi-choice, parse the stored answer
      if (nextQuestion.type === "multi-choice") {
        setMultiChoices(nextAnswer ? nextAnswer.split(", ") : []);
      } else {
        setMultiChoices([]);
      }
    } else {
      // Submit form
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAnswers),
        });

        if (response.ok) {
          setIsComplete(true);
        } else {
          alert(lang === "he" ? "שגיאה בשליחת הטופס" : "Error submitting form");
        }
      } catch (error) {
        console.error(error);
        alert(lang === "he" ? "שגיאה בשליחת הטופס" : "Error submitting form");
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
      [currentQuestion.id]: choice,
    };
    setAnswers(newAnswers);

    // Check if this question was already answered (user came back)
    const wasAlreadyAnswered =
      answers[currentQuestion.id] !== undefined &&
      answers[currentQuestion.id] !== "";

    // Only auto-advance if this is the first time answering
    if (!wasAlreadyAnswered) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setCurrentAnswer(newAnswers[questions[currentStep + 1].id] || "");
        } else {
          // Last question - submit
          handleNext();
        }
      }, 300);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentQuestion.type !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleBack = () => {
    setValidationError("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevQuestion = questions[currentStep - 1];
      const prevAnswer = answers[prevQuestion.id] || "";
      setCurrentAnswer(prevAnswer);

      // If previous question is multi-choice, parse the stored answer
      if (prevQuestion.type === "multi-choice") {
        setMultiChoices(prevAnswer ? prevAnswer.split(", ") : []);
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
      setMultiChoices(multiChoices.filter((c) => c !== option));
    } else {
      setMultiChoices([...multiChoices, option]);
    }
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div
        className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-4 font-mono"
        dir={mounted ? (lang === "he" ? "rtl" : "ltr") : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Title + Description */}
          <div className="text-center mb-6">
            <h1 className="text-2xl text-[var(--text-primary)] mb-2 font-bold">
              {lang === "he" ? "ליווי 1:1 עם אריק" : "1:1 Coaching with Arik"}
            </h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {lang === "he"
                ? "הטופס הזה נועד לעזור לי ולך כמה שיותר."
                : "This form is designed to help me and you as much as possible."}
            </p>
          </div>

          {/* IG-style Bio Section */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 mb-8" style={{ border: "1px solid var(--border-color)" }}>
            {/* Avatar + Name row */}
            <div className="flex items-center gap-4 mb-4" dir={lang === "he" ? "rtl" : "ltr"}>
              <div
                className="w-16 h-16 rounded-full flex-shrink-0 p-[2.5px]"
                style={{ background: "linear-gradient(135deg, var(--brand-orange), var(--brand-orange-light))" }}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src="/propic.jpg"
                    alt="Arik"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center -24px" }}
                  />
                </div>
              </div>
              <div className={lang === "he" ? "text-right" : "text-left"}>
                <div className="text-base font-bold text-[var(--text-primary)]">Arik</div>
                <div className="text-sm text-[var(--text-muted)]">@arik.moz</div>
              </div>
            </div>

            {/* Bio text */}
            <div className={`text-sm text-[var(--text-primary)] leading-relaxed ${lang === "he" ? "text-right" : "text-left"}`} dir={lang === "he" ? "rtl" : "ltr"}>
              <p>{lang === "he" ? "15+ שנים של ניסיון בכושר, תזונה ומנטליות." : "15+ years of fitness, nutrition & mindset experience."} 💪🏼🔥</p>
              <p className="text-[var(--brand-orange)] font-semibold">
                {lang === "he" ? "90 ימים לשנות את הגוף. שנים לחיות ככה." : "90 days to change your body. Years to live like it."}
              </p>
              <p className="text-[var(--text-muted)] mt-1">
                {lang === "he" ? "התחילו את הדרך שלכם עכשיו ⬇️" : "Start your journey now ⬇️"}
              </p>
              <p className="mt-1">
                <span>🏋️🏃🤸‍♂️ | 👨‍💻📈🚀</span>
              </p>
              <p className="text-[var(--brand-orange)] text-sm mt-1">arikmoz.com</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
          <div className="flex flex-col gap-4 items-center justify-center mb-8">
            {lang === "he" ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setLang("he");
                  }}
                  className="px-8 py-3 bg-[var(--brand-orange)] text-[#F5F4F0] rounded font-bold text-base hover:bg-[var(--brand-orange-light)] transition-colors cursor-pointer"
                >
                  התחל עכשיו
                </button>
                <span className="text-sm text-[var(--text-primary)]">
                  לחץ <strong>Enter ↵</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    setLang("en");
                  }}
                  className="px-8 py-3 bg-[var(--brand-orange)] text-[#F5F4F0] rounded font-bold text-base hover:bg-[var(--brand-orange-light)] transition-colors cursor-pointer"
                >
                  Start Now
                </button>
                <span className="text-sm text-[var(--text-primary)]">
                  press <strong>Enter ↵</strong>
                </span>
              </div>
            )}
          </div>

          <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-2">
            <Clock size={16} />
            {lang === "he" ? "לוקח 3-5 דקות" : "Takes 3-5 minutes"}
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setLang(lang === "he" ? "en" : "he")}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
            >
              {lang === "he" ? "English" : "עברית"}
            </button>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--brand-orange)] transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success Screen
  if (isComplete) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4 font-mono"
        dir={mounted ? (lang === "he" ? "rtl" : "ltr") : undefined}
      >
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
            {lang === "he" ? "תודה רבה!" : "Thank you!"}
          </h1>
          <p className="text-lg">
            {lang === "he"
              ? "הפגישה נקבעה בהצלחה! נתראה בקרוב."
              : "Consultation booked successfully! See you soon."}
          </p>
        </motion.div>
      </div>
    );
  }

  // Determine gender for language customization
  const isFemale = answers.gender === "Female" || answers.gender === "נקבה";

  // Display question based on gender and language
  const displayQuestion = (() => {
    if (lang === "he") {
      if (isFemale && currentQuestion.questionHeFemale) {
        return currentQuestion.questionHeFemale;
      } else if (!isFemale && currentQuestion.questionHeMale) {
        return currentQuestion.questionHeMale;
      }
      return currentQuestion.questionHe;
    }
    return currentQuestion.question;
  })();

  // Use gender-specific options if they exist
  const displayOptions = (() => {
    if (lang === "he") {
      if (isFemale && currentQuestion.optionsHeFemale) {
        return currentQuestion.optionsHeFemale;
      } else if (!isFemale && currentQuestion.optionsHeMale) {
        return currentQuestion.optionsHeMale;
      }
      return currentQuestion.optionsHe;
    }
    // For English, only female-specific options exist for main_goal
    if (isFemale && currentQuestion.optionsFemale) {
      return currentQuestion.optionsFemale;
    }
    return currentQuestion.options;
  })();

  // Display placeholder based on gender and language
  const displayPlaceholder = (() => {
    if (lang === "he") {
      if (isFemale && currentQuestion.placeholderHeFemale) {
        return currentQuestion.placeholderHeFemale;
      } else if (!isFemale && currentQuestion.placeholderHeMale) {
        return currentQuestion.placeholderHeMale;
      }
      return currentQuestion.placeholderHe;
    }
    return currentQuestion.placeholder;
  })();

  // Question Screen
  return (
    <div
      className="min-h-screen bg-[var(--bg-page)] flex flex-col font-mono relative"
      dir={mounted ? (lang === "he" ? "rtl" : "ltr") : undefined}
    >
      {/* Theme toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--brand-orange)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[var(--border-color)]">
        <motion.div
          className="h-full bg-[var(--brand-orange)]"
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
                className="mb-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm cursor-pointer transition-colors"
              >
                {lang === "he" ? "→ חזור אחורה" : "← Go back"}
              </button>

              {/* Question number and title */}
              <div className="mb-4">
                <span className="text-base text-[var(--text-primary)] font-bold">
                  {currentStep + 1}. {displayQuestion}
                </span>
              </div>

              {/* Description (optional) */}
              {!currentQuestion.hideDescription && (
                <p className="text-sm text-[var(--text-muted)] italic mb-8">
                  {lang === "he"
                    ? currentQuestion.descriptionHe || "תיאור (אופציונלי)"
                    : currentQuestion.description || "Description (optional)"}
                </p>
              )}

              {/* Multi-choice note */}
              {currentQuestion.type === "multi-choice" &&
                (currentQuestion.multiChoiceNote ||
                  currentQuestion.multiChoiceNoteHe) && (
                  <p className="text-sm text-[var(--text-muted)] italic mb-4">
                    {lang === "he"
                      ? currentQuestion.multiChoiceNoteHe
                      : currentQuestion.multiChoiceNote}
                  </p>
                )}

              {currentQuestion.type === "choice" ? (
                <div className="space-y-3" dir="ltr">
                  {displayOptions?.map((option, index) => {
                    const isSelected = currentAnswer === option;
                    const wasAlreadyAnswered =
                      answers[currentQuestion.id] !== undefined &&
                      answers[currentQuestion.id] !== "";
                    return (
                      <button
                        key={index}
                        onClick={() => handleChoice(option)}
                        className={`w-full text-left px-5 py-3 bg-[var(--bg-card)] border rounded transition-all text-base group cursor-pointer ${
                          isSelected && wasAlreadyAnswered
                            ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--text-primary)]"
                            : "border-[var(--border-color)] hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/5 text-[var(--text-primary)]"
                        }`}
                      >
                        <span
                          className={`mr-3 text-sm ${isSelected && wasAlreadyAnswered ? "text-[var(--brand-orange)]" : "text-[var(--text-muted)] group-hover:text-[var(--brand-orange)]"}`}
                        >
                          {isSelected && wasAlreadyAnswered
                            ? "✓"
                            : String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : currentQuestion.type === "multi-choice" ? (
                <div className="space-y-3" dir="ltr">
                  {displayOptions?.map((option, index) => {
                    const isSelected = multiChoices.includes(option);
                    return (
                      <button
                        key={index}
                        onClick={() => handleMultiChoiceToggle(option)}
                        className={`w-full text-left px-5 py-3 bg-[var(--bg-card)] border rounded transition-all text-base group cursor-pointer ${
                          isSelected
                            ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10"
                            : "border-[var(--border-color)] hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/5"
                        }`}
                      >
                        <span
                          className={`mr-3 text-sm ${isSelected ? "text-[var(--brand-orange)]" : "text-[var(--text-muted)] group-hover:text-[var(--brand-orange)]"}`}
                        >
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-[var(--text-primary)]">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : currentQuestion.type === "calendar" ? (
                <>
                  {console.log("Cal.com prefill data:", {
                    name: answers.name,
                    email: answers.email,
                    phone: answers.phone,
                  })}
                  <div
                    className="w-full bg-[var(--bg-card)] rounded-lg p-4 shadow-lg"
                    style={{ minHeight: "500px" }}
                  >
                    <Cal
                      namespace="arik-moz-1-1"
                      calLink="arik-moz/arik-moz-1-1"
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "scroll",
                      }}
                      config={{
                        layout: "week_view",
                        theme: "light",
                        name: answers.name || "",
                        email: answers.email || "",
                        phone: answers.phone || "",
                        guests: [answers.email || ""],
                      }}
                    />
                    {calendarBooked && (
                      <div className="mt-4 p-4 text-[var(--text-primary)] rounded text-center">
                        <div className="text-xl font-bold mb-2">
                          {lang === "he" ? "תודה רבה!" : "Thank you!"}
                        </div>
                        <div className="text-base mb-4">
                          {lang === "he"
                            ? "הפגישה נקבעה בהצלחה, נתראה בקרוב"
                            : "Appointment booked successfully, see you soon"}
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 bg-[var(--brand-orange)] text-[#F5F4F0] rounded font-bold text-base hover:bg-[var(--brand-orange-light)] transition-colors cursor-pointer "
                        >
                          {lang === "he"
                            ? "חזרה למסך הבית"
                            : "Back to home screen"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : currentQuestion.type === "textarea" ? (
                <>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => {
                      setCurrentAnswer(e.target.value);
                      setValidationError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder={displayPlaceholder}
                    className="w-full bg-transparent border-b border-[var(--border-color)] py-2 text-[var(--text-primary)] text-lg placeholder-[var(--placeholder-color)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                    rows={1}
                    autoFocus
                  />
                </>
              ) : (
                <>
                  <input
                    type={currentQuestion.type}
                    value={currentAnswer}
                    onChange={(e) => {
                      setCurrentAnswer(e.target.value);
                      setValidationError("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder={displayPlaceholder}
                    className={`w-full bg-transparent border-b py-2 text-[var(--text-primary)] text-lg placeholder-[var(--placeholder-color)] focus:outline-none transition-colors ${
                      validationError
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--border-color)] focus:border-[var(--brand-orange)]"
                    }`}
                    autoFocus
                  />
                  {validationError && (
                    <div className="mt-2 text-sm text-red-500">
                      {validationError}
                    </div>
                  )}
                </>
              )}

              {currentQuestion.type !== "choice" &&
                currentQuestion.type !== "multi-choice" &&
                currentQuestion.type !== "calendar" &&
                !isSubmitting && (
                  <div className="mt-8 text-sm text-[var(--text-primary)] hidden md:block">
                    {lang === "he" ? (
                      <>
                        לחץ <strong>Enter ↵</strong>
                      </>
                    ) : (
                      <>
                        press <strong>Enter ↵</strong>
                      </>
                    )}
                  </div>
                )}

              {currentQuestion.type === "textarea" && (
                <div className="mt-4 text-xs text-[var(--text-muted)]">
                  {lang === "he"
                    ? "Shift + Enter ליצירת שורה חדשה"
                    : "Shift + Enter to make a line break"}
                </div>
              )}

              {/* Next Button - Hide for calendar and choice questions on first answer */}
              {(() => {
                const wasAlreadyAnswered =
                  answers[currentQuestion.id] !== undefined &&
                  answers[currentQuestion.id] !== "";
                const shouldShowNextButton =
                  currentQuestion.type !== "calendar" &&
                  !(currentQuestion.type === "choice" && !wasAlreadyAnswered);

                return (
                  shouldShowNextButton && (
                    <div className="mt-8">
                      <button
                        onClick={handleNext}
                        disabled={
                          isSubmitting ||
                          (currentQuestion.type === "multi-choice" &&
                            multiChoices.length === 0 &&
                            currentQuestion.hideDescription !== false) ||
                          (currentQuestion.type === "choice" &&
                            !currentAnswer.trim() &&
                            currentQuestion.hideDescription !== false) ||
                          (currentQuestion.type !== "choice" &&
                            currentQuestion.type !== "multi-choice" &&
                            !currentAnswer.trim() &&
                            currentQuestion.hideDescription !== false)
                        }
                        className="px-6 py-3 bg-[var(--brand-orange)] text-[#F5F4F0] rounded font-bold text-base hover:bg-[var(--brand-orange-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting
                          ? lang === "he"
                            ? "שולח..."
                            : "Submitting..."
                          : currentStep < questions.length - 1
                            ? lang === "he"
                              ? "← הבא"
                              : "Next →"
                            : lang === "he"
                              ? "שלח"
                              : "Submit"}
                      </button>
                    </div>
                  )
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
