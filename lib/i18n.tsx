"use client";

/**
 * English/Arabic translation for the whole site.
 *
 * The dictionary maps English strings (UI labels AND the content
 * currently in config/*.json) to Arabic. Components call t("...") and
 * unknown strings fall back to English, so nothing ever breaks.
 *
 * NOTE: if you edit a text in config/*.json, also update its matching
 * Arabic entry here — otherwise that one text shows in English while
 * Arabic mode is on.
 *
 * When Arabic is active the whole document flips to RTL.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "ar";

const AR: Record<string, string> = {
  // ── Navbar & footer ──
  Home: "الرئيسية",
  About: "نبذة عني",
  Skills: "المهارات",
  Projects: "المشاريع",
  Education: "التعليم",
  Resume: "السيرة الذاتية",
  Certificates: "الشهادات",
  Contact: "تواصل",

  // ── Hero ──
  "View My Portfolio": "استعرض أعمالي",
  "Download Resume": "تحميل السيرة الذاتية",
  "Hi, I'm Said! A Software Engineer and AI/ML Engineer from Pakistan. I'm a Software Engineer and AI/ML Engineer with hands-on experience in Machine Learning, Deep Learning, Generative AI, and Computer Vision. From agentic AI and RAG applications to computer-vision systems, I like taking projects end to end, from data and models to APIs and UIs.":
    "مرحباً، أنا سعيد! مهندس برمجيات ومهندس ذكاء اصطناعي وتعلّم آلة من باكستان، أمتلك خبرة عملية في تعلّم الآلة والتعلّم العميق والذكاء الاصطناعي التوليدي والرؤية الحاسوبية. من تطبيقات الوكلاء الأذكياء وRAG إلى أنظمة الرؤية الحاسوبية، أحب إنجاز المشاريع من البداية إلى النهاية: من البيانات والنماذج إلى واجهات البرمجة وواجهات الاستخدام.",

  // ── Section headings ──
  "About me": "نبذة عني",
  "Engineering intelligence, end to end": "هندسة الذكاء، من البداية إلى النهاية",
  "Tools I build with": "أدواتي في البناء",
  "Selected work": "أعمال مختارة",
  "Education & experience": "التعليم والخبرة",
  "Where I learned the craft": "أين تعلّمت هذه الحرفة",
  "The one-pager": "صفحة واحدة تلخّص كل شيء",
  "Proof of learning": "إثبات التعلّم",
  "Let's build something": "لنبنِ شيئاً معاً",

  // ── Section descriptions ──
  "From model training to production UIs, grouped by where they fit in the stack.":
    "من تدريب النماذج إلى واجهات الإنتاج، مصنّفة حسب موقعها في المنظومة.",
  "AI products taken from idea to working software, each with its own detail page.":
    "مشاريع ذكاء اصطناعي من الفكرة إلى برنامج يعمل، ولكل منها صفحة تفاصيل خاصة.",
  "View it right here, or grab a copy to keep.":
    "اطّلع عليها هنا، أو حمّل نسخة للاحتفاظ بها.",
  "Have a project, an internship lead, or just a question about AI? My inbox is open.":
    "لديك مشروع أو فرصة عمل أو سؤال عن الذكاء الاصطناعي؟ بريدي مفتوح دائماً.",

  // ── About content (from config/profile.json) ──
  "I completed my BSc in Software Engineering at the University of Malakand and interned as a Software Engineer at Eziline, where I built and evaluated ML/DL models and supported real AI/ML project work. I care about clean architecture, measurable model performance, and interfaces people actually enjoy using.":
    "أكملتُ درجة البكالوريوس في هندسة البرمجيات من جامعة مالاكاند، وتدرّبت كمهندس برمجيات في شركة Eziline حيث بنيتُ وقيّمتُ نماذج تعلّم آلة وتعلّم عميق وشاركتُ في مشاريع ذكاء اصطناعي حقيقية. أهتم بالبنية البرمجية النظيفة وأداء النماذج القابل للقياس وواجهات يستمتع الناس باستخدامها.",
  "My goal is to build AI systems that solve real problems by combining solid software engineering with modern machine learning to ship products that are reliable, fast, and useful.":
    "هدفي بناء أنظمة ذكاء اصطناعي تحل مشكلات حقيقية، بالجمع بين هندسة برمجيات متينة وتعلّم آلة حديث لتقديم منتجات موثوقة وسريعة ومفيدة.",
  "Agentic AI & RAG applications": "الوكلاء الأذكياء وتطبيقات RAG",
  "Computer Vision": "الرؤية الحاسوبية",
  "Generative AI": "الذكاء الاصطناعي التوليدي",
  "Full-stack web engineering": "تطوير الويب المتكامل",
  "Years of hands-on coding": "سنوات من البرمجة العملية",
  "Projects completed": "مشاريع منجزة",
  "ML/DL models trained": "نماذج تعلّم آلة مدرّبة",
  "Technologies used": "تقنيات مستخدمة",

  // ── Timeline / education / experience ──
  "BSc in Software Engineering": "بكالوريوس هندسة البرمجيات",
  "University of Malakand": "جامعة مالاكاند",
  "Graduated with a BSc in Software Engineering, specializing in Artificial Intelligence, Machine Learning, and full-stack web development.":
    "تخرّجت بدرجة البكالوريوس في هندسة البرمجيات، بتخصص في الذكاء الاصطناعي وتعلّم الآلة وتطوير الويب المتكامل.",
  "Software Engineering Intern": "متدرّب هندسة برمجيات",
  "Developed and tested software modules within a collaborative engineering workflow.":
    "طوّرت واختبرت وحدات برمجية ضمن بيئة عمل هندسية تعاونية.",
  "Built and evaluated Machine Learning and Deep Learning models using Python.":
    "بنيت وقيّمت نماذج تعلّم آلة وتعلّم عميق باستخدام بايثون.",
  "Supported AI/ML project tasks including data preparation, model training, and testing.":
    "دعمت مهام مشاريع الذكاء الاصطناعي، بما في ذلك تجهيز البيانات وتدريب النماذج والاختبار.",
  Achievements: "الإنجازات",
  "Continuous learning": "تعلّم مستمر",
  "Shipped end-to-end AI products including JobPilot, XJMU AI Consultant, and AI Species Explorer.":
    "أنجزت منتجات ذكاء اصطناعي متكاملة تشمل JobPilot وXJMU AI Consultant وAI Species Explorer.",
  "Trained and evaluated ML/DL models on real project work and keep expanding into generative and agentic AI.":
    "درّبت وقيّمت نماذج تعلّم آلة في مشاريع حقيقية، وأواصل التوسّع في الذكاء الاصطناعي التوليدي والوكيلي.",
  "Agentic AI · RAG · Computer Vision": "وكلاء أذكياء · RAG · رؤية حاسوبية",

  // ── Skills group names ──
  "AI / ML": "الذكاء الاصطناعي وتعلّم الآلة",
  "Programming & Data": "البرمجة والبيانات",
  "Tools & Backend": "الأدوات والأنظمة الخلفية",

  // ── Projects (taglines + descriptions from config/projects.json) ──
  "AI job search agent": "وكيل ذكاء اصطناعي للبحث عن الوظائف",
  "A full-stack agentic AI application that parses resumes, fetches live listings from legal job APIs, and scores every job against the resume with embedding-based semantic matching and skill-gap analysis. A LangGraph agent layer with 8 nodes (search, matching, resume writing, cover letters, company research, interview coaching) works alongside a RAG pipeline over user documents using ChromaDB.":
    "تطبيق وكيل ذكاء اصطناعي متكامل يحلّل السير الذاتية ويجلب الوظائف مباشرة من واجهات برمجية قانونية ويقيّم كل وظيفة مقابل السيرة الذاتية عبر مطابقة دلالية قائمة على التضمين وتحليل فجوات المهارات. تعمل طبقة وكيل LangGraph المكوّنة من 8 عُقد (البحث، المطابقة، كتابة السيرة، خطابات التقديم، بحث الشركات، تدريب المقابلات) جنباً إلى جنب مع خط RAG فوق مستندات المستخدم باستخدام ChromaDB.",
  "AI-powered consultation assistant": "مساعد استشاري مدعوم بالذكاء الاصطناعي",
  "An AI-powered consultation assistant that answers user queries conversationally using large language models. Prompt and retrieval workflows ground every response in domain knowledge, so guidance about the university, fees, eligibility, and admissions stays accurate and context-aware.":
    "مساعد استشاري يجيب عن استفسارات المستخدمين بأسلوب حواري باستخدام النماذج اللغوية الكبيرة. تُرسّخ تدفقات الاسترجاع وهندسة الأوامر كلَّ إجابة في المعرفة المتخصصة، ليبقى الإرشاد حول الجامعة والرسوم وشروط القبول دقيقاً ومراعياً للسياق.",
  "Computer-vision species identification": "التعرّف على الكائنات بالرؤية الحاسوبية",
  "An AI application for exploring and identifying species. Computer vision and machine learning classify uploaded images and surface rich species information, turning a photo into an instant, informative species profile.":
    "تطبيق ذكاء اصطناعي لاستكشاف الكائنات والتعرّف عليها. تصنّف الرؤية الحاسوبية وتعلّم الآلة الصور المرفوعة وتعرض معلومات غنية، لتتحول الصورة إلى ملف تعريفي فوري عن الكائن.",
  "Final year project: AI smart-park monitoring": "مشروع التخرّج: مراقبة ذكية للحدائق",
  "An AI-driven environmental and security monitoring system designed for smart parks. Machine learning and computer vision techniques detect and track environmental and safety conditions across the park in real time.":
    "نظام مراقبة بيئي وأمني مدعوم بالذكاء الاصطناعي مصمَّم للحدائق الذكية. تكشف تقنيات تعلّم الآلة والرؤية الحاسوبية الأوضاع البيئية وظروف السلامة وتتعقّبها في الوقت الفعلي.",
  Details: "التفاصيل",
  "Live Demo": "عرض مباشر",

  "Tap below to view or save my resume as a PDF.":
    "اضغط أدناه لعرض سيرتي الذاتية أو حفظها بصيغة PDF.",
  "Open Resume": "عرض السيرة الذاتية",

  // ── Contact form ──
  Name: "الاسم",
  Email: "البريد الإلكتروني",
  Subject: "الموضوع",
  Message: "الرسالة",
  "Send message": "إرسال الرسالة",
};

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => undefined,
  t: (text) => text,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Restore the saved choice after mount (avoids hydration mismatch).
  useEffect(() => {
    const saved = window.localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  // Arabic reads right-to-left: flip the whole document.
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
    window.localStorage.setItem("lang", next);
  };

  const t = (text: string) => (lang === "ar" ? (AR[text] ?? text) : text);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
