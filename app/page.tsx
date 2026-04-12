"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sun, Moon, ArrowDown, Send } from "lucide-react";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"en" | "he">("he");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const isHe = lang === "he";
  const dir = mounted ? (isHe ? "rtl" : "ltr") : undefined;

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setValidationError("");

    if (!name.trim()) {
      setValidationError(isHe ? "אנא הזן שם" : "Please enter your name");
      return;
    }
    const digitsOnly = phone.replace(/[^\d]/g, "");
    if (digitsOnly.length < 9) {
      setValidationError(isHe ? "אנא הזן מספר טלפון תקין" : "Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email: email || undefined, goal }),
      });
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(isHe ? "שגיאה בשליחת הטופס" : "Error submitting form");
      }
    } catch {
      alert(isHe ? "שגיאה בשליחת הטופס" : "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-mono" dir={dir}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--bg-page)]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(isHe ? "en" : "he")}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
          >
            {isHe ? "EN" : "עב"}
          </button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--brand-orange)] transition-colors cursor-pointer"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
        <button
          onClick={scrollToForm}
          className="px-4 py-1.5 bg-[var(--brand-orange)] text-[#F5F4F0] rounded text-xs font-bold hover:bg-[var(--brand-orange-light)] transition-colors cursor-pointer"
        >
          {isHe ? "השאר פרטים" : "Get Started"}
        </button>
      </div>

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-8">
            {isHe
              ? "הגעת לפה כי משהו עד עכשיו לא עבד."
              : "You're here because something hasn't worked until now."}
          </h1>

          <div className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed space-y-2">
            <p>{isHe ? "אולי ירדת במשקל — וחזרת." : "Maybe you lost weight — and gained it back."}</p>
            <p>{isHe ? "אולי התחלת — ועצרת." : "Maybe you started — and stopped."}</p>
            <p>{isHe ? "אולי אתה מתאמן כבר שנים ועדיין לא שם." : "Maybe you've been training for years and still aren't there."}</p>
          </div>

          <div className="mt-10 text-base md:text-lg text-[var(--text-primary)] leading-relaxed space-y-1">
            <p>{isHe ? "זה לא בגלל שאתה חלש." : "It's not because you're weak."}</p>
            <p className="text-[var(--brand-orange)] font-semibold">
              {isHe
                ? "זה בגלל שאף אחד לא בנה לך תוכנית שמתאימה לך — ולחיים שיש לך."
                : "It's because no one built you a plan that fits you — and the life you have."}
            </p>
          </div>

          <motion.button
            onClick={scrollToForm}
            className="mt-12 text-[var(--text-muted)] hover:text-[var(--brand-orange)] transition-colors cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown size={28} />
          </motion.button>
        </motion.div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <div className="flex items-center gap-4 mb-8" dir={isHe ? "rtl" : "ltr"}>
              <div
                className="w-20 h-20 rounded-full flex-shrink-0 p-[3px]"
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
              <div className={isHe ? "text-right" : "text-left"}>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  {isHe ? "אני אריק." : "I'm Arik."}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {isHe ? "+15 שנים של ניסיון בכושר, תזונה ובריאות 💪🏼" : "15+ years of experience in fitness, nutrition & health 💪🏼"}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="text-base md:text-lg text-[var(--text-primary)] leading-relaxed space-y-3">
              <p>{isHe ? "אני לא בונה גוף תוצאה לרגע." : "I don't build bodies for a moment."}</p>
              <p className="font-semibold">
                {isHe ? "אני בונה גוף תוצאה שנשאר איתך לעבוד בעוד 20 שנה." : "I build bodies that still work in 20 years."}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8 text-base md:text-lg text-[var(--text-primary)] leading-relaxed">
              <p>{isHe ? "כוח. סיבולת. תנועה. תזונה. בריאות. אריחות ימים. ראש" : "Strength. Endurance. Movement. Nutrition. Mindset."}</p>
              <p className="text-[var(--brand-orange)] font-semibold mt-1">
                {isHe ? "הכל ביחד — כי אף אחד מהם לא עובד לבד." : "Together — because none of them work alone."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="py-20 px-6 bg-[var(--bg-card)]">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
              {isHe ? "ליווי 1 על 1 אישי" : "Personal 1-on-1 Coaching"}
            </h2>
            <p className="text-[var(--text-muted)] mb-10">
              {isHe ? "לא תוכנית מהאינטרנט." : "Not a plan from the internet."}
            </p>
          </FadeIn>

          <div className="space-y-5">
            {[
              {
                he: "תוכנית אימונים שבנויה סביב החיים שלך",
                en: "A training plan built around your life",
              },
              {
                he: "תזונה שאפשר לחיות איתה — לא רק שבועיים",
                en: "Nutrition you can live with — not just for two weeks",
              },
              {
                he: "מעקב שבועי ושינויים בזמן אמת",
                en: "Weekly tracking and real-time adjustments",
              },
              {
                he: "אני זמין. לא בוט. לא PDF.",
                en: "I'm available. Not a bot. Not a PDF.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-3" dir={isHe ? "rtl" : "ltr"}>
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[var(--brand-orange)] flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <p className="text-base md:text-lg text-[var(--text-primary)]">
                    {isHe ? item.he : item.en}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 text-base md:text-lg text-[var(--text-primary)] leading-relaxed space-y-1">
              <p>{isHe ? "תוך פחות מ - 90 ימים תרגיש את זה." : "Within 90 days you'll feel it."}</p>
              <p className="text-[var(--brand-orange)] font-bold text-lg md:text-xl">
                {isHe ? "לשארית החיים — תחיה את זה." : "For the rest of your life — you'll live it."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SOCIAL PROOF + CTA ===== */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
              {isHe ? "רוב הלקוחות שלי הגיעו אחרי שכבר ניסו." : "Most of my clients came after they already tried."}
            </p>
            <p className="text-base md:text-lg text-[var(--text-primary)] font-semibold mt-1">
              {isHe ? "זה בדיוק הנקודה שממנה אנחנו מתחילים." : "That's exactly where we start."}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section ref={formRef} className="py-20 px-6 bg-[var(--bg-card)]">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
                {isHe ? "השאר פרטים" : "Leave Your Details"}
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                {isHe
                  ? "ואחזור אליך תוך 24 שעות. שיחה ראשונה — בלי עלות, בלי התחייבות."
                  : "I'll get back to you within 24 hours. First call — free, no commitment."}
              </p>
            </div>
          </FadeIn>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {isHe ? "תודה רבה!" : "Thank you!"}
              </h3>
              <p className="text-[var(--text-muted)]">
                {isHe ? "קיבלתי את הפרטים שלך, אחזור אליך בהקדם." : "Got your details, I'll get back to you soon."}
              </p>
            </motion.div>
          ) : (
            <FadeIn delay={0.15}>
              <div className="space-y-5" dir={isHe ? "rtl" : "ltr"}>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">
                    {isHe ? "שם" : "Name"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setValidationError(""); }}
                    placeholder={isHe ? "השם שלך" : "Your name"}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--placeholder-color)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">
                    {isHe ? "טלפון" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^[+\d][\d\s\-]*$/.test(val) && val !== "") return;
                      setPhone(val);
                      setValidationError("");
                    }}
                    placeholder={isHe ? "050-123-4567" : "555-0123"}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--placeholder-color)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">
                    {isHe ? "אימייל" : "Email"}{" "}
                    <span className="text-[var(--placeholder-color)]">({isHe ? "לא חובה" : "optional"})</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setValidationError(""); }}
                    placeholder={isHe ? "name@example.com" : "name@example.com"}
                    dir="ltr"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--placeholder-color)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">
                    {isHe ? "מה המטרה שלך?" : "What's your goal?"}
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => { setGoal(e.target.value); setValidationError(""); }}
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: "no-repeat", backgroundPosition: isHe ? "left 12px center" : "right 12px center", backgroundSize: "16px" }}
                  >
                    <option value="" disabled>{isHe ? "בחר מטרה..." : "Choose a goal..."}</option>
                    <option value={isHe ? "ירידה במשקל / שריפת שומן" : "Weight loss / fat burn"}>{isHe ? "ירידה במשקל / שריפת שומן" : "Weight loss / fat burn"}</option>
                    <option value={isHe ? "בניית שריר וחיטוב" : "Build muscle & tone"}>{isHe ? "בניית שריר וחיטוב" : "Build muscle & tone"}</option>
                    <option value={isHe ? "שיפור כושר וסיבולת" : "Improve fitness & endurance"}>{isHe ? "שיפור כושר וסיבולת" : "Improve fitness & endurance"}</option>
                    <option value={isHe ? "תזונה נכונה ואורח חיים בריא" : "Healthy nutrition & lifestyle"}>{isHe ? "תזונה נכונה ואורח חיים בריא" : "Healthy nutrition & lifestyle"}</option>
                    <option value={isHe ? "חזרה לכושר אחרי הפסקה" : "Getting back after a break"}>{isHe ? "חזרה לכושר אחרי הפסקה" : "Getting back after a break"}</option>
                    <option value={isHe ? "אחר" : "Other"}>{isHe ? "אחר" : "Other"}</option>
                  </select>
                </div>

                {validationError && (
                  <p className="text-sm text-red-500">{validationError}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[var(--brand-orange)] text-[#F5F4F0] rounded-lg font-bold text-base hover:bg-[var(--brand-orange-light)] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    isHe ? "שולח..." : "Submitting..."
                  ) : (
                    <>
                      <Send size={18} />
                      {isHe ? "שלח — ואני אחזור אליך" : "Send — and I'll get back to you"}
                    </>
                  )}
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-6 px-6 text-center text-xs text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} Arik Moz</p>
      </footer>
    </div>
  );
}
