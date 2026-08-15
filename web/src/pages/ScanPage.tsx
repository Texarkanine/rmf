import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Grain, displayHost } from "../components/Grain";
import { IconBrowser } from "../components/icons";
import { KitStar, StageDressing, kit } from "../kit";

const STEPS = [
  {
    label: "Ads",
    src: kit.iconAds,
    status: "Opening the ad library.",
    note: "Counting angles. Judging the lighting. Looking for a product.",
  },
  {
    label: "Landing page",
    status: "Walking the first impression.",
    note: "If the offer is below the fold, it already missed the laugh.",
  },
  {
    label: "Product page",
    src: kit.iconProduct,
    status: "Reading the product page.",
    note: "Looking for a reason to buy — not just a gallery with good taste.",
  },
  {
    label: "Cart",
    src: kit.iconCart,
    status: "Opening the cart.",
    note: "Counting extra fields like extra verses. The room is getting restless.",
  },
  {
    label: "Checkout",
    src: kit.iconCheckout,
    status: "Sitting in checkout.",
    note: "Hunting for surprise shipping. It always kills the room.",
  },
];

const STEP_MS = 2200;

export function ScanPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = params.get("url") || "https://yourstore.com";
  const host = displayHost(url);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStep(STEPS.length - 1);
      setDone(true);
      return;
    }

    const id = window.setInterval(() => {
      setStep((current) => {
        if (current >= STEPS.length - 1) {
          return current;
        }
        return current + 1;
      });
    }, STEP_MS);

    const doneTimer = window.setTimeout(() => {
      window.clearInterval(id);
      setDone(true);
    }, STEP_MS * STEPS.length);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const current = STEPS[step];
  const progress = done ? 100 : Math.round(((step + 0.35) / STEPS.length) * 100);

  return (
    <div className="page scan-page">
      <Grain />
      <header className="site-header">
        <Link className="brand" to="/">
          <img src="/assets/logo.png" alt="Roast My Funnel" />
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link to="/#how">How it works</Link>
          <Link to="/#roast">What we roast</Link>
          <span className="scan-pill">Scanning</span>
        </nav>
      </header>

      <section className="stage scan-stage">
        <StageDressing swag footlights />
        <div className="stage-inner">
          <p className="scan-eyebrow">
            Backstage · {done ? "Doors opening" : "Do not enter"}
          </p>
          <div className="hero-mark">
            <img src="/assets/logo-mark.png" alt="" />
          </div>
          <h1 className="scan-title">
            {done ? "The tape is in." : "Hold for the lights."}
          </h1>
          <p className="lede">
            Tracing <span className="scan-host">{host}</span> from first
            impression to final checkout.
          </p>

          <div className="scan-board">
            <p className="scan-status">
              {done ? "Whole show. Ready when you are." : current.status}
            </p>
            <p className="scan-note">
              {done
                ? "We walked the ads, the pages, the cart, and checkout. Time to hear both sides."
                : current.note}
            </p>
            <div className="scan-meter" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="scan-meter-label">
              {done ? "Scan complete" : `Reviewing ${current.label.toLowerCase()}`}
            </p>
          </div>

          <div className="tickets scan-tickets">
            {STEPS.map(({ label, src }, index) => {
              const state =
                done || index < step ? "is-done" : index === step ? "is-active" : "is-pending";
              return (
                <article className={`ticket ${state}`} key={label}>
                  {src ? (
                    <img className="ticket-icon" src={src} alt="" />
                  ) : (
                    <IconBrowser className="ticket-icon" />
                  )}
                  <h3>{label}</h3>
                  <div className="ticket-stars">
                    <KitStar />
                    <KitStar />
                    <KitStar />
                  </div>
                </article>
              );
            })}
          </div>

          {done ? (
            <button
              className="scan-cta"
              type="button"
              onClick={() =>
                navigate(`/results?url=${encodeURIComponent(url)}`)
              }
            >
              Bring out the roast
            </button>
          ) : (
            <p className="tagline">Roast the funnel. Not the marketer.</p>
          )}
        </div>
      </section>
    </div>
  );
}
