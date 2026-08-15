import type { Finding, RoastReport } from "./types";

const ad00 = "/assets/demo/ad-00s.png";
const ad03 = "/assets/demo/ad-03s.png";
const ad08 = "/assets/demo/ad-08s.png";
const adLast = "/assets/demo/ad-last.png";
const landingShot = "/assets/demo/landing.png";
const productShot = "/assets/demo/product.png";
const cartShot = "/assets/demo/cart.png";
const checkoutShot = "/assets/demo/checkout.png";

const gymReplacement =
  "Everything you need to replace traditional gym machines like squat rack, free weights, and more—in one sleek, wall-mounted system.";

const findings: Finding[] = [
  {
    id: "f-promise",
    stage: "landing",
    title: "Shop Tonal 2 now dumps to the lobby",
    punchline:
      "The ad replaced a gym in twelve seconds. Then Learn More opened the gift shop.",
    diagnosis:
      "Meta Ad Library 2110273689844971 is a 12s vertical video. At 3s the overlay is “GET IT ALL ON YOUR” with a squat rack, bench, slam ball, dumbbell, and kettlebell floating around the machine. At 8s it is “STRENGTH, CARDIO & MORE IN ONE SLEEK SYSTEM.” Headline: Shop Tonal 2 now. CTA: Learn More. Destination: tonal.com homepage. The homepage H1 is “THE ULTIMATE STRENGTH TRAINING SYSTEM” — that matches the ad’s description line, not the video. First-viewport CTAs are Shop Now and Explore Tonal. The gym-replacement overlay never appears.",
    whyItMatters:
      "Paid traffic clicked a specific visual promise (the whole gym, on your wall) and landed on a brand manifesto. That is a likely conversion leak even when the tagline is technically related.",
    fix: "Point this ad at Tonal 2, or put the 3s overlay in the homepage hero: the machines, the wall, Shop Tonal 2. Do not lead with Explore.",
    showMe: {
      headline: "Get it all on your wall.",
      copy: "Squat rack, free weights, cardio — one sleek system. The machine from the ad, not a catalog.",
      sectionOrder: [
        "Hero + gym-replacement still",
        "Tonal 2 in that move",
        "The real number",
        "Shop Tonal 2",
      ],
      instructions:
        "Use the 3s frame as the first-viewport still. Keep “ultimate system” below the fold. Primary CTA: Shop Tonal 2.",
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
        "Matching the gym-replacement overlay in the first viewport will lift paid traffic from homepage to Tonal 2.",
      change:
        "Swap the system headline for “Get it all on your wall” and show the 3s still.",
      kpi: "Paid landing-page to product-page rate",
      guardrail: "Bounce rate",
      success: "Product-page rate improves without a bounce-rate spike.",
    },
  },
  {
    id: "f-membership",
    stage: "checkout",
    title: "The $5,215 ticket is missing the membership",
    punchline:
      "Checkout took a bow at $5,215. The 12-month membership is still in the wings.",
    diagnosis:
      "Checkout line items are Tonal 2 $4,295, Essential Accessories Bundle $495, and Extended 4 Year Warranty $425 — subtotal $5,215. Shipping is “enter your address.” Membership is not in the order. PDP copy says the 12-month $59.95/mo membership is purchased separately after installation. Homepage mentions the commitment under a later membership section. The checkout total looks complete and is not.",
    whyItMatters:
      "Shoppers who think $5,215 is the number will meet another bill after the wall is up. Late commitment is a classic checkout-to-regret leak, even when the term is disclosed somewhere earlier.",
    fix: "Put membership term, monthly price, and “billed after install” next to the checkout total — and next to the first Shop CTA.",
    showMe: {
      copy: "Due today $5,215 + shipping/install. Then $59.95/mo for 12 months after install. HSA/FSA eligible.",
      instructions:
        "Add a cost stack on PDP, cart drawer, and checkout: hardware, required bundle, warranty, membership, install. Do not wait for the device to ask.",
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
        "Showing membership in the checkout total will reduce post-purchase sticker shock and support-ticket regret.",
      change:
        "Surface $59.95/mo × 12 months next to the $5,215 subtotal on PDP, cart, and checkout.",
      kpi: "Checkout start to purchase rate",
      guardrail: "Add-to-cart rate",
      success: "Checkout completion rises without hurting add-to-cart.",
    },
  },
  {
    id: "f-accessories",
    stage: "product",
    title: "Get it all — plus $495 to unlock the moves",
    punchline:
      "The ad said the whole gym is on your wall. The product page said the handles are extra.",
    diagnosis:
      "The 3s overlay floats a squat rack, bench, slam ball, dumbbell, and kettlebell onto Tonal. PDP copy: Essential Accessories Bundle +$495 is “Required to unlock 285+ movements across upper body, lower body, and core.” You can decline the bundle. The ad did not mention a second product.",
    whyItMatters:
      "A required accessory presented as an upsell is a message-match break. Shoppers who believed “get it all” meet a $495 gate on the page that is supposed to close.",
    fix: "Lead Tonal 2 with the complete system the ad showed. If the bundle is required to do the moves in the video, it is not optional — say so next to $4,295.",
    showMe: {
      headline: "The gym from the ad. Handles included.",
      copy: "Tonal 2 + Essential Accessories — the squat rack, the bar, the handles. $5,215 before membership and install.",
      sectionOrder: ["Complete system + price", "Membership + install", "Specs"],
    },
    impact: "high",
    effort: "low",
    confidence: "high",
    owner: "copy",
    priority: "fix_before_spend",
    evidence: "observed",
    screenshot: productShot,
    hotspot: "circle",
    defaultQueue: "fix_now",
    test: {
      hypothesis:
        "Selling the complete system the ad showed will lift add-to-cart on this creative.",
      change:
        "Default the Essential bundle on, and put “required for 285+ moves” next to the $4,295 price.",
      kpi: "PDP to add-to-cart rate",
      guardrail: "Average order value",
      success: "Add-to-cart rises; AOV stays at or above the bundled total.",
    },
  },
  {
    id: "f-lp",
    stage: "landing",
    title: "This video deserved its own page",
    punchline:
      "You paid for a gym collapsing onto a wall. You sent it to the lobby.",
    diagnosis:
      "The destination is tonal.com, which has to serve everyone. It cannot continue a 12s gym-replacement spot. A single-purpose LP can: 3s still, overlay line, complete price, Shop Tonal 2.",
    whyItMatters:
      "Highest-leverage test in the account: same ad, matched page, versus the current homepage dump.",
    fix: "Build one LP that continues this creative. Do not redesign tonal.com.",
    showMe: {
      headline: "Get it all on your wall.",
      instructions:
        "One LP for this angle. Same CTA. Split traffic: LP vs homepage.",
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
      hypothesis:
        "A message-matched LP will beat the homepage for this video ad.",
      change: "Split this Library ID between a dedicated LP and tonal.com.",
      kpi: "Cost per Tonal 2 add-to-cart",
      guardrail: "CTR of the ad",
      success: "Add-to-cart CPA improves at similar or better CTR.",
    },
  },
  {
    id: "f-proof",
    stage: "landing",
    title: "Press and members are three scrolls down",
    punchline:
      "The first screen is still introducing itself. The receipts are in the encore.",
    diagnosis:
      "Homepage has “WHAT TONAL MEMBERS ARE SAYING” and “WHAT THE PRESS IS SAYING.” They sit under coaches, programs, and brand story. The first viewport is H1 + Shop Now + Explore Tonal. No proof beside the CTA.",
    whyItMatters:
      "A $4,295 wall gym plus membership asks for trust immediately. Buried proof may increase hesitation after a paid click.",
    fix: "Place one press line and one member result next to the first Shop CTA.",
    showMe: {
      copy: "One press quote. One member result. Next to Shop Tonal 2.",
      sectionOrder: ["Hero + proof strip", "The gym from the ad", "The real number"],
    },
    impact: "medium",
    effort: "low",
    confidence: "high",
    owner: "design",
    priority: "high_value_test",
    evidence: "observed",
    screenshot: landingShot,
    hotspot: "circle",
    defaultQueue: "later",
    test: {
      hypothesis: "Proof beside the first CTA will increase Shop clicks from paid traffic.",
      change: "Hero proof strip: one press quote, one member result.",
      kpi: "Hero Shop click rate",
      guardrail: "Scroll depth",
      success: "Shop clicks rise; people still scroll to programs.",
    },
  },
];

export const mockReport: RoastReport = {
  storeName: "Tonal",
  storeUrl: "https://tonal.com/",
  scannedAt: "August 15, 2026",
  verdict:
    "The ad replaced a gym in twelve seconds. Then you sent them to the gift shop.",
  leak: "Shop Tonal 2 now lands on the homepage. The video’s gym-replacement hook never makes the first screen, and checkout’s $5,215 total still hides the membership.",
  strongest:
    "The 12-second creative. Overlay, machines, wall. That is the part of the set that works.",
  firstActions: [
    "Point this ad at Tonal 2 — or put the 3s gym-replacement still in the hero.",
    "Test a matched LP against the homepage dump.",
    "The 12-second spot. Do not remake the ad.",
  ],
  coverage: [
    "1 Meta video ad (frames + copy) · Library 2110273689844971",
    "Homepage destination",
    "Tonal 2 product page",
    "Cart drawer on PDP",
    "Checkout page load ($5,215, shipping TBD)",
  ],
  confidence:
    "High on what is on the page (observed). Conversion impact is inferred. Revenue dollars are unverified without Shopify or Meta data.",
  overallScore: 64,
  overallLabel: "The ad did the job. The site took a bow.",
  categories: [
    { id: "clarity", label: "Clarity", score: 74 },
    { id: "match", label: "Message Match", score: 56 },
    { id: "offer", label: "Offer", score: 58 },
    { id: "trust", label: "Trust", score: 72 },
    { id: "friction", label: "Friction", score: 52 },
    { id: "mobile", label: "Mobile", score: 70 },
  ],
  ad: {
    libraryId: "2110273689844971",
    libraryUrl: "https://www.facebook.com/ads/library/?id=2110273689844971",
    primaryText: gymReplacement,
    headline: "Shop Tonal 2 now",
    description: "The ultimate strength training system",
    cta: "Learn More",
    displayUrl: "TONAL.COM",
    destinationUrl: "https://tonal.com/",
    started: "Jul 28, 2026",
    frames: [
      { label: "0s", src: ad00 },
      {
        label: "3s",
        src: ad03,
        overlay: "GET IT ALL ON YOUR + floating gym machines",
      },
      {
        label: "8s",
        src: ad08,
        overlay: "STRENGTH, CARDIO & MORE IN ONE SLEEK SYSTEM",
      },
      { label: "last", src: adLast, overlay: "TONAL end card" },
    ],
  },
  funnel: [
    {
      id: "ads",
      stage: "ads",
      label: "Facebook Ad",
      url: "Meta Ad Library 2110273689844971",
      screenshot: ad03,
      promise: "Replace the squat rack, free weights, and more — on your wall.",
      score: 84,
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
      score: 54,
      issueCount: 2,
      status: "observed",
    },
    {
      id: "product",
      stage: "product",
      label: "Product Page",
      url: "tonal.com/products/tonal-2",
      screenshot: productShot,
      promise: "Tonal 2 from $4,295. Accessories extra, and required.",
      score: 62,
      issueCount: 1,
      status: "observed",
    },
    {
      id: "cart",
      stage: "cart",
      label: "Cart",
      url: "tonal.com · cart drawer",
      screenshot: cartShot,
      promise: "$5,215 in the bag. Membership still offstage.",
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
      promise: "$5,215. Shipping unknown. Membership billed later.",
      score: 46,
      issueCount: 1,
      status: "observed",
    },
  ],
  mismatches: [
    {
      id: "m-dump",
      from: "Facebook Ad",
      to: "Landing Page",
      summary: "Dumps to the lobby",
    },
  ],
  findings,
  crowdKillerIds: ["f-promise", "f-membership", "f-accessories"],
  writersRoom: [
    {
      id: "w-headline",
      kind: "headline",
      title: "Homepage H1",
      before: "The ultimate strength training system.",
      after: "Get it all on your wall.",
    },
    {
      id: "w-cta",
      kind: "cta",
      title: "Primary CTA",
      before: "Shop now · Explore Tonal",
      after: "Shop Tonal 2 — the gym that replaces the gym",
    },
    {
      id: "w-offer",
      kind: "offer",
      title: "Cost stack",
      before: "Membership purchased separately after install.",
      after:
        "Due today $5,215 + install. Then $59.95/mo for 12 months. HSA/FSA eligible.",
    },
  ],
  nextSet: [
    { when: "today", text: "Continue the 3s overlay in the first viewport.", findingId: "f-promise" },
    { when: "today", text: "Put membership next to the $5,215 total.", findingId: "f-membership" },
    { when: "today", text: "Sell the complete system the ad showed.", findingId: "f-accessories" },
    { when: "week", text: "Test a matched LP against the homepage dump.", findingId: "f-lp" },
    { when: "later", text: "Move one press line next to Shop.", findingId: "f-proof" },
  ],
  scorecards: [
    {
      id: "ads",
      title: "Ads",
      keyFinding:
        "The creative has a product, a payoff, and a pulse. Send it somewhere that continues the bit.",
      metrics: [
        { label: "Headline match", value: 3, kind: "stars" },
        { label: "Product clarity", value: 5, kind: "stars" },
        { label: "Offer", value: 3, kind: "stars" },
        { label: "CTA", value: 4, kind: "stars" },
      ],
    },
    {
      id: "landing",
      title: "Landing + PDP",
      keyFinding:
        "Homepage is a brand lobby. The video wanted the gym on the wall. PDP then charges $495 to unlock the moves.",
      metrics: [
        { label: "Hero clarity", value: 3, kind: "stars" },
        { label: "Message match", value: 2, kind: "stars" },
        { label: "Proof", value: 3, kind: "stars" },
        { label: "CTA hierarchy", value: 3, kind: "stars" },
      ],
    },
    {
      id: "cart",
      title: "Cart + Checkout",
      keyFinding:
        "$5,215 looks like the number. Membership and shipping are still plot twists.",
      metrics: [
        { label: "Surprise costs", value: 4, kind: "chili" },
        { label: "Trust", value: 3, kind: "stars" },
        { label: "Express pay", value: 4, kind: "stars" },
        { label: "Field load", value: 4, kind: "chili" },
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
