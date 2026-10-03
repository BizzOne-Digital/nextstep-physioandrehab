import type { TeamMemberItem } from "@/types";

// Team information as published on the existing website.
export const defaultTeam: TeamMemberItem[] = [
  {
    name: "Priya",
    slug: "priya",
    title: "Registered Physiotherapist",
    image: "/images/team/priya-closeup.webp",
    shortBio:
      "A dedicated and compassionate physiotherapist helping patients restore movement, reduce pain and reach their rehabilitation goals through evidence-based, patient-centred care.",
    fullBio: [
      "Priya is a dedicated and compassionate physiotherapist committed to helping patients restore movement, reduce pain and achieve their rehabilitation goals. She completed her Bachelor of Physiotherapy and practises in Ontario, providing evidence-based, patient-centred care.",
      "Priya has experience treating a wide range of musculoskeletal and neurological conditions, including sports injuries, neck and back pain, joint conditions, post-operative rehabilitation, balance and gait impairments, and vestibular disorders. Her treatment approach includes manual therapy, joint mobilizations, soft tissue techniques, therapeutic exercise, kinesiology taping and individualized rehabilitation programs tailored to each patient's needs.",
      "She believes in educating and empowering patients throughout their recovery, creating a supportive environment that promotes long-term health, function and overall well-being.",
    ].join("\n\n"),
    qualifications: ["Bachelor of Physiotherapy", "Registered Physiotherapist, Ontario"],
    specialties: [
      "Sports injuries",
      "Neck & back pain",
      "Post-operative rehabilitation",
      "Balance & gait",
      "Vestibular disorders",
      "Manual therapy",
      "Kinesiology taping",
    ],
    order: 1,
    published: true,
  },
];
