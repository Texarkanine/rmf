import type { Finding, RoastReport } from "./types";

const adShot = "/assets/tape-ad.png";
const landingShot = "/assets/tape-landing.png";
const checkoutShot = "/assets/tape-checkout.png";

const findings: Finding[] = [
  {
    id: "f-promise",
    stage: "landing",
    title: "The promise disappears after the click",
    punchline:
      "The ad said get strong, stay strong — and pilates, reformed. The homepage said ‘ultimate system’ and asked you to browse.",
    diagnosis:
      "The Meta creative leads with a specific payoff (Get strong. Stay strong. / Experience Pilates, reformed). The ad destination is tonal.com, whose H1 is “The ultimate strength training system.” The workout, coach, and offer from the video are not on that first screen.",
    whyItMatters:
      "This is a likely conversion risk. Shoppers who clicked a specific promise have to re-interpret the offer on a generic homepage, which can weaken landing-page to product-page conversion.",
    fix: "Repeat the ad’s promise in the hero: the move they just watched, the coach, and a Shop CTA that continues the video — not a brand manifesto.",
    showMe: {
      headline: "Get strong. Stay strong. On your wall.",
      copy: "Digital weights that adjust every rep. Coaches on the screen. The workout from the ad, not a catalog.",
      sectionOrder: ["Hero + Tonal 2 in use", "The move from the ad", "Proof", "Membership in plain English", "Shop Tonal 2"],
      instructions:
        "Replace the homepage H1 with the ad line. Put a still from the video in the first viewport. Keep “ultimate system” below the fold.",
    },
    impact: "high",
    effort: "low",
    confidence: "high",
    owner: "copy",
    priority: "fix_before_spend",
    evidence: "observed",
    screenshot: landingShot,
    hotspot: "underline",
    defaultQueue: "fix_now",
    test: {
      hypothesis:
        "Matching the ad promise in the hero will lift homepage to Tonal 2 click-through from paid traffic.",
      change: "Swap the system headline for the ad’s get-strong / pilates line and show the machine in use.",
      kpi: "Paid landing-page to product-page rate",
      guardrail: "Bounce rate",
      success: "Product-page rate improves without a bounce-rate spike.",
    },
  },
  {
    id: "f-membership",
    stage: "checkout",
    title: "Membership and install arrive for the encore",
    punchline:
      "The hardware took a bow. Then a 12-month membership and an install fee walked on without being introduced.",
    diagnosis:
      "Tonal requires a 12-month membership at $59.95/month, plus install. Those commitments are easy to miss on the homepage (they sit under “Unlock a new level of training”) and get loud in cart and checkout as line items after the shopper has already said yes to the wall.",
    whyItMatters:
      "Late commitment reveals can increase checkout abandonment. Shoppers who feel the total cost changed after add-to-cart often stall or leave. Impact on revenue is inferred without Shopify data.",
    fix: "Put membership term, monthly price, and install expectations next to the first Shop CTA and on the Tonal 2 page — before cart.",
    showMe: {
      copy: "Tonal 2 + $59.95/mo membership (12 months) · Pro install available. HSA/FSA eligible.",
      instructions:
        "Add a cost stack under the price on PDP: hardware, membership, install. Repeat it in the cart summary. Do not wait for checkout.",
    },
    impact: "high",
    effort: "medium",
    confidence: "high",
    owner: "copy",
    priority: "fix_before_spend",
    evidence: "observed",
    screenshot: checkoutShot,
    hotspot: "shipping",
    defaultQueue: "fix_now",
    test: {
      hypothesis:
        "Showing membership and install before checkout will reduce sticker-shock abandonment.",
      change: "Surface the $59.95/mo term and install on PDP and cart.",
      kpi: "Checkout start to purchase rate",
      guardrail: "Add-to-cart rate",
      success: "Checkout completion rises without hurting add-to-cart.",
    },
  },
  {
    id: "f-proof",
    stage: "landing",
    title: "Your best proof is buried",
    punchline:
      "Press quotes and member results are three scrolls too deep. The first screen is still introducing itself.",
    diagnosis:
      "“Tonal 2 Has Finally Made Me Like Strength Training” and member quotes exist on the homepage. They sit under coaches, programs, and brand story. The first viewport asks for Shop / Explore with no proof beside the CTA.",
    whyItMatters:
      "A several-thousand-dollar wall gym with a membership asks for trust immediately. Buried proof may increase hesitation after a paid click.",
    fix: "Place one press line and one member result next to the first Shop CTA.",
    showMe: {
      copy: "“Best Smart Home Gym: Tonal 2.” · “I’m the strongest I’ve ever been.” — Arlene K., 66",
      sectionOrder: ["Hero + proof strip", "The workout", "Membership", "Coaches"],
    },
    impact: "medium",
    effort: "low",
    confidence: "high",
    owner: "design",
    priority: "high_value_test",
    evidence: "observed",
    screenshot: landingShot,
    hotspot: "circle",
    defaultQueue: "test_next",
    test: {
      hypothesis: "Proof beside the first CTA will increase Shop clicks from paid traffic.",
      change: "Hero proof strip: one press quote, one member result.",
      kpi: "Hero Shop click rate",
      guardrail: "Scroll depth",
      success: "Shop clicks rise; people still scroll to programs.",
    },
  },
  {
    id: "f-lp",
    stage: "landing",
    title: "The video deserved its own page",
    punchline:
      "You paid for a pilates-reformed, coach-on-the-wall story. You sent it to the lobby.",
    diagnosis:
      "Top video ads dump to the homepage. The homepage has to serve everyone. It cannot continue a specific creative. A dedicated LP would.",
    whyItMatters:
      "This is the highest-leverage test in the account: same ad, matched page, versus the current homepage dump.",
    fix: "Build a single-purpose landing page that continues the primary ad: hook, machine in that move, proof, membership in one line, Shop Tonal 2.",
    showMe: {
      headline: "Experience Pilates, reformed. Only on Tonal.",
      instructions:
        "One LP per winning angle (Pilates, Tony Horton, get-strong). Same CTA. Do not redesign tonal.com.",
    },
    impact: "high",
    effort: "medium",
    confidence: "high",
    owner: "creative",
    priority: "high_value_test",
    evidence: "observed",
    screenshot: landingShot,
    defaultQueue: "test_next",
    test: {
      hypothesis: "A message-matched LP will beat the homepage for the same video ad.",
      change: "Split traffic from the primary ad to a dedicated LP vs homepage.",
      kpi: "Cost per Tonal 2 add-to-cart",
      guardrail: "CPM / CTR of the ad",
      success: "Add-to-cart CPA improves at similar or better CTR.",
    },
  },
  {
    id: "f-pdp",
    stage: "product",
    title: "Tonal 2 explains the machine, not the move they clicked",
    punchline:
      "They came for the workout in the ad. You handed them a spec sheet.",
    diagnosis:
      "The path is Shop → Tonal 2. The PDP has to close a high-consideration sale. If it leads with system features instead of the ad’s outcome (every rep just right, pilates, a named coach), the story breaks a second time.",
    whyItMatters:
      "A second mismatch on the product page can stall add-to-cart even after a shopper survived the homepage.",
    fix: "Lead Tonal 2 with the outcome from the traffic source. Specs and accessories below the first CTA.",
    showMe: {
      headline: "Every rep. Just right.",
      sectionOrder: ["Outcome + machine", "Membership + install", "Proof", "Specs"],
    },
    impact: "medium",
    effort: "medium",
    confidence: "medium",
    owner: "copy",
    priority: "worth_cleaning",
    evidence: "inferred",
    screenshot: null,
    defaultQueue: "later",
    test: {
      hypothesis: "Outcome-first PDP copy will lift add-to-cart on paid traffic.",
      change: "Reorder Tonal 2 modules to match the ad angle.",
      kpi: "PDP to add-to-cart rate",
      guardrail: "PDP bounce",
      success: "Add-to-cart rises; bounce stays flat.",
    },
  },
];

export const mockReport: RoastReport = {
  storeName: "Tonal",
  storeUrl: "https://tonal.com/",
  scannedAt: "August 15, 2026",
  verdict:
    "Your ads know what they’re selling. Your landing page appears to have forgotten.",
  leak: "The ad promise disappears after the click — video ads dump to the homepage, and the homepage does not continue the video.",
  strongest:
    "The Meta creative. Get strong / pilates reformed / every rep just right is a real hook. That is the part of the set that works.",
  firstActions: [
    "Repeat the ad promise in the homepage hero.",
    "Put membership and install next to Shop.",
    "Test a dedicated LP against the homepage dump.",
  ],
  coverage: [
    "1 Meta video ad (frames + copy)",
    "Homepage destination",
    "Tonal 2 product page",
    "Cart",
    "Checkout page load",
  ],
  confidence:
    "High on what is on the page (observed). Conversion impact is inferred. Revenue dollars are unverified without Shopify or Meta data.",
  overallScore: 62,
  overallLabel: "Needs better material.",
  categories: [
    { id: "clarity", label: "Clarity", score: 72 },
    { id: "match", label: "Message Match", score: 48 },
    { id: "offer", label: "Offer", score: 66 },
    { id: "trust", label: "Trust", score: 74 },
    { id: "friction", label: "Friction", score: 58 },
    { id: "mobile", label: "Mobile", score: 70 },
  ],
  funnel: [
    {
      id: "ads",
      stage: "ads",
      label: "Facebook Ad",
      url: "Meta Ad Library 2110273689844971",
      screenshot: adShot,
      promise: "Get strong. Stay strong. Pilates, reformed.",
      score: 72,
      issueCount: 0,
      status: "observed",
    },
    {
      id: "landing",
      stage: "landing",
      label: "Landing Page",
      url: "tonal.com/",
      screenshot: landingShot,
      promise: "The ultimate strength training system.",
      score: 48,
      issueCount: 3,
      status: "observed",
    },
    {
      id: "product",
      stage: "product",
      label: "Product Page",
      url: "tonal.com · Shop → Tonal 2",
      screenshot: null,
      promise: "The machine. Specs. Shop.",
      score: 64,
      issueCount: 1,
      status: "observed",
    },
    {
      id: "cart",
      stage: "cart",
      label: "Cart",
      url: "tonal.com/cart",
      screenshot: null,
      promise: "Hardware, then the rest of the bill.",
      score: 58,
      issueCount: 1,
      status: "observed",
    },
    {
      id: "checkout",
      stage: "checkout",
      label: "Checkout",
      url: "tonal.com/checkout",
      screenshot: checkoutShot,
      promise: "Membership + install as the encore.",
      score: 44,
      issueCount: 1,
      status: "observed",
    },
  ],
  mismatches: [
    {
      id: "m-promise",
      from: "Facebook Ad",
      to: "Landing Page",
      summary: "Promise mismatch",
    },
  ],
  findings,
  crowdKillerIds: ["f-promise", "f-membership", "f-proof"],
  writersRoom: [
    {
      id: "w-headline",
      kind: "headline",
      title: "Homepage H1",
      before: "The ultimate strength training system.",
      after: "Get strong. Stay strong. On your wall.",
    },
    {
      id: "w-cta",
      kind: "cta",
      title: "Primary CTA",
      before: "Shop now · Explore Tonal",
      after: "Shop the workout from the ad",
    },
    {
      id: "w-offer",
      kind: "offer",
      title: "Cost stack",
      before: "Membership details live under a later section.",
      after: "Tonal 2 + $59.95/mo (12 months) · Pro install · HSA/FSA eligible.",
    },
  ],
  nextSet: [
    { when: "today", text: "Repeat the ad promise in the hero.", findingId: "f-promise" },
    { when: "today", text: "Reveal membership and install beside Shop.", findingId: "f-membership" },
    { when: "week", text: "Test a message-matched LP against the homepage.", findingId: "f-lp" },
    { when: "later", text: "Lead Tonal 2 with the move they clicked.", findingId: "f-pdp" },
  ],
  scorecards: [
    {
      id: "ads",
      title: "Ads",
      keyFinding: "The creative has a product, a payoff, and a pulse. Send it somewhere that continues the bit.",
      metrics: [
        { label: "Headline match", value: 4, kind: "stars" },
        { label: "Product clarity", value: 5, kind: "stars" },
        { label: "Offer", value: 4, kind: "stars" },
        { label: "CTA", value: 4, kind: "stars" },
      ],
    },
    {
      id: "landing",
      title: "Landing + PDP",
      keyFinding: "Homepage is a brand lobby. Paid traffic wanted the workout they just watched.",
      metrics: [
        { label: "Hero clarity", value: 2, kind: "stars" },
        { label: "Message match", value: 2, kind: "stars" },
        { label: "Proof", value: 3, kind: "stars" },
        { label: "CTA hierarchy", value: 3, kind: "stars" },
      ],
    },
    {
      id: "cart",
      title: "Cart + Checkout",
      keyFinding: "Membership and install are real. They should not be a plot twist.",
      metrics: [
        { label: "Surprise costs", value: 4, kind: "chili" },
        { label: "Trust", value: 3, kind: "stars" },
        { label: "Express pay", value: 4, kind: "stars" },
        { label: "Field load", value: 3, kind: "chili" },
      ],
    },
    {
      id: "mobile",
      title: "Mobile",
      keyFinding: "Usable. The miss is the story, not the tap targets.",
      metrics: [
        { label: "Tap targets", value: 4, kind: "stars" },
        { label: "Speed", value: 2, kind: "chili" },
        { label: "CTA visibility", value: 3, kind: "stars" },
        { label: "Layout", value: 4, kind: "stars" },
      ],
    },
  ],
};
