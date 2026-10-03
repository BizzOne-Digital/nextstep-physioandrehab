import type { FAQItem } from "@/types";

// FAQs from the existing website, with wording cleaned up.
export const defaultFaqs: FAQItem[] = [
  {
    question: "Do I need to pay if I have insurance?",
    answer:
      "It depends on how much of the treatment cost your plan covers. If your plan covers 100%, you may not need to pay anything beyond your deductible. If it covers 80%, you would pay the remaining 20%. Please check with your plan provider, or contact us and we can help find out for you. We offer direct billing with many insurance companies.",
    category: "Billing & Insurance",
    showOnHome: true,
    order: 1,
    published: true,
  },
  {
    question: "Which therapy is best for my pain?",
    answer:
      "It depends on your symptoms and any recommendation from your family physician. A physiotherapy or chiropractic assessment helps us understand the nature of your pain and how many sessions may be needed. Our team will complete a full assessment and recommend the best treatment plan for you.",
    category: "Treatment",
    showOnHome: true,
    order: 2,
    published: true,
  },
  {
    question: "Do I need a physician's referral for physiotherapy?",
    answer:
      "No, a doctor's referral is not required to access physiotherapy. However, some insurance plans require one for reimbursement, so it is a good idea to check with your insurance provider. In most cases you can book with us directly.",
    category: "Getting Started",
    showOnHome: true,
    order: 3,
    published: true,
  },
  {
    question: "Is physiotherapy covered by OHIP?",
    answer:
      "Coverage for physiotherapy under public health care in Ontario is limited and depends on eligibility. Most patients use extended health insurance, auto insurance (for motor vehicle accidents) or WSIB (for workplace injuries). Contact us and we can help you understand your options.",
    category: "Billing & Insurance",
    showOnHome: false,
    order: 4,
    published: true,
  },
  {
    question: "When should I start physiotherapy after an injury?",
    answer:
      "The best time to start depends on the type and severity of your injury. In many cases, beginning soon after an injury helps prevent further problems and supports a faster recovery. Speak with a healthcare professional who can assess your situation and advise when to begin.",
    category: "Treatment",
    showOnHome: true,
    order: 5,
    published: true,
  },
  {
    question: "How often will I need to come in?",
    answer:
      "Visit frequency depends on your individual needs and treatment plan. We will discuss it during your initial consultation, based on your health goals and condition.",
    category: "Treatment",
    showOnHome: false,
    order: 6,
    published: true,
  },
  {
    question: "How long is the first appointment?",
    answer:
      "The length of your first appointment depends on the service you are booking. Initial assessments usually take longer than follow-up visits so we have time to understand your history and goals. Contact us with your appointment details and we can give you a more accurate estimate.",
    category: "Getting Started",
    showOnHome: false,
    order: 7,
    published: true,
  },
];
