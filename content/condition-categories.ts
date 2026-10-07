// Context for each condition category, used on the individual condition pages.
// General, non-diagnostic wording; services listed are the clinic's own.

export interface ConditionCategoryInfo {
  intro: string;
  approach: string[];
  services: string[]; // service slugs
}

export const CONDITION_CATEGORY_INFO: Record<string, ConditionCategoryInfo> = {
  "Spine, Neck & Back": {
    intro:
      "Spine, neck and back problems can affect how you sit, sleep, work and move. Care usually starts with an assessment of your posture, movement and the activities that bring on symptoms, so treatment can target the underlying cause rather than only the pain.",
    approach: ["Assessment of posture, mobility and nerve-related symptoms", "Hands-on care such as joint mobilization and soft tissue work", "Exercises to restore movement and build core and spinal strength", "Guidance on posture, ergonomics and activity"],
    services: ["physiotherapy", "chiropractic-treatment", "massage-therapy", "acupuncture"],
  },
  "Joints & Arthritis": {
    intro:
      "Joint conditions such as arthritis, tendonitis and stiffness can make everyday tasks harder. Treatment focuses on easing pain, protecting the joint and keeping you moving with a plan that fits your activity level.",
    approach: ["Assessment of joint range of motion and strength", "Gentle mobilization and soft tissue techniques", "Progressive strengthening and flexibility exercises", "Bracing or supports where they may help"],
    services: ["physiotherapy", "massage-therapy", "braces-clinic", "acupuncture"],
  },
  "Sports & Injuries": {
    intro:
      "Sprains, strains, fractures and overuse injuries need the right balance of rest and progressive loading. Rehabilitation aims to restore strength, mobility and confidence so you can return to sport, work and daily life safely.",
    approach: ["Injury assessment and a clear recovery timeline", "Manual therapy and modalities to manage pain and swelling", "Progressive strength, balance and sport-specific exercise", "Return-to-activity planning and injury prevention"],
    services: ["physiotherapy", "massage-therapy", "braces-clinic", "chiropractic-treatment"],
  },
  "Foot & Ankle": {
    intro:
      "Foot and ankle problems such as plantar fasciitis and flat feet can affect your whole kinetic chain, including knees, hips and back. Care looks at how you stand and walk, and what support your feet need.",
    approach: ["Gait and foot-posture assessment", "Stretching and strengthening for the foot and calf", "Hands-on treatment to ease pain and stiffness", "Custom orthotics or bracing where appropriate"],
    services: ["custom-orthotics", "physiotherapy", "braces-clinic", "compression-stockings"],
  },
  "Nerve & Neurological": {
    intro:
      "Nerve-related and neurological conditions can affect sensation, strength, balance and coordination. Rehabilitation is tailored to your goals and works alongside the care you receive from your physician or specialist.",
    approach: ["Assessment of strength, balance, coordination and function", "Graded exercise and functional retraining", "Balance and gait work to support safe movement", "Education and a home program for ongoing progress"],
    services: ["physiotherapy", "acupuncture", "massage-therapy"],
  },
  "Chronic Pain & Wellness": {
    intro:
      "Long-term pain, fibromyalgia, headaches and stress-related conditions are often influenced by many factors. A whole-person approach combines hands-on care, movement and practical strategies to help you manage symptoms and improve quality of life.",
    approach: ["A full history to understand what affects your symptoms", "Gentle manual therapy and relaxation-focused treatment", "Graded activity and exercise you can sustain", "Support for stress, sleep and coping strategies"],
    services: ["massage-therapy", "acupuncture", "physiotherapy", "counselling"],
  },
  "Circulation & Respiratory": {
    intro:
      "Swelling, lymphatic issues and some respiratory conditions can limit comfort and activity. Care focuses on improving circulation, managing swelling and building tolerance for daily activity, in coordination with your medical care.",
    approach: ["Assessment of swelling, mobility and activity tolerance", "Compression garments where recommended", "Gentle movement, breathing and circulation exercises", "Soft tissue techniques to support comfort"],
    services: ["compression-stockings", "massage-therapy", "physiotherapy"],
  },
  "Women's Health & Surgery": {
    intro:
      "Pregnancy, the postnatal period, pelvic health and surgery all bring specific rehabilitation needs. Care is private, respectful and paced to you, with the aim of restoring strength, comfort and function.",
    approach: ["A confidential assessment with your consent at every step", "Pelvic floor and core retraining where appropriate", "Pre- and post-surgical exercise programs", "Guidance for a safe return to daily activity"],
    services: ["pelvic-floor-rehabilitation", "physiotherapy", "massage-therapy", "acupuncture"],
  },
};

export const DEFAULT_CATEGORY_INFO: ConditionCategoryInfo = CONDITION_CATEGORY_INFO["Sports & Injuries"];
