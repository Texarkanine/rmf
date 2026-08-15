import { DEMO_FUNNEL_URL } from "../demoFunnel";

export const DEFAULT_ROAST_URL = DEMO_FUNNEL_URL;

export const PEPPER_SCALE = 5;

export const SAMPLE_HEAT = [
  { label: "Clarity", score: 2 },
  { label: "Offer", score: 3 },
  { label: "Trust", score: 3 },
  { label: "Checkout", score: 4 },
] as const;

export const TAPE_ROASTS = [
  {
    n: 1,
    title: "Ad creative",
    punch: "Great lighting. Still no idea what you sell.",
    note: "Show the product and the benefit in the first second.",
  },
  {
    n: 2,
    title: "Landing page",
    punch: "The offer arrived fashionably late.",
    note: "Move it above the fold.",
  },
  {
    n: 3,
    title: "Checkout",
    punch: "Surprise shipping. Always kills the room.",
    note: "Reveal delivery costs earlier.",
  },
] as const;
