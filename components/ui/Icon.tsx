import {
  Accessibility, Activity, Baby, Bandage, Bone, Brain, Car, Crosshair, Dumbbell, Flower2, Footprints,
  HandHeart, HardHat, HeartHandshake, HeartPulse, Leaf, MessageCircleHeart, PersonStanding, ShieldPlus,
  Sparkles, Stethoscope, Target, Waves, Wind, type LucideIcon,
} from "lucide-react";

// Whitelisted icons that admins can choose for services (stored by name).
const ICONS: Record<string, LucideIcon> = {
  Accessibility, Activity, Baby, Bandage, Bone, Brain, Car, Crosshair, Dumbbell, Flower2, Footprints,
  HandHeart, HardHat, HeartHandshake, HeartPulse, Leaf, MessageCircleHeart, PersonStanding, ShieldPlus,
  Sparkles, Stethoscope, Target, Waves, Wind,
};

export function ServiceIcon({ name, className, strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const Cmp = ICONS[name] ?? Activity;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export const SERVICE_ICON_COMPONENTS = ICONS;
