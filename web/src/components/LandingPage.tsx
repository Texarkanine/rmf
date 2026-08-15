import { FormEvent, useId, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Grain } from "./Grain";
import { Flourish, IconBrowser } from "./icons";
import { scanPath } from "../demoFunnel";
import {
  DEFAULT_ROAST_URL,
  PEPPER_SCALE,
  SAMPLE_HEAT,
  TAPE_ROASTS,
} from "./landingContent";
import {
  FrameCorners,
  KitStar,
  StageDressing,
  kit,
} from "../kit";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#roast", label: "What we roast" },
  { href: "#sample", label: "Sample report" },
];

const TICKETS = [
  { label: "Ads", src: kit.iconAds },
  { label: "Landing page" },
  { label: "Product page", src: kit.iconProduct },
  { label: "Cart", src: kit.iconCart },
  { label: "Checkout", src: kit.iconCheckout },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState(DEFAULT_ROAST_URL);

  function onRoast(event: FormEvent) {
    event.preventDefault();
    navigate(scanPath(url));
  }

  return (
    <div className="page landing">
      <Grain />
      <header className="site-header">
        <a className="brand" href="#top">
          <img src="/assets/logo.png" alt="Roast My Funnel" />
        </a>
        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="ghost" href="#login">
            Log in
          </a>
        </nav>
      </header>

      <section className="stage hero" id="top">
        <StageDressing />
        <div className="stage-inner">
          <h1>
            <span className="h1-line">Your funnel says it’s fine.</span>
            <span className="h1-line">Let’s hear both sides.</span>
          </h1>
          <p className="lede">
            We inspect your ads, landing pages, product pages, cart, and
            checkout—then roast what’s costing you sales.
          </p>
          <RoastForm
            url={url}
            onUrl={setUrl}
            onSubmit={onRoast}
            button="Put my funnel on the grill"
          />
          <p className="tagline">Roast the funnel. Not the marketer.</p>
          <div className="gold-rule" />
        </div>
      </section>

      <section className="parchment tickets-section" id="roast">
        <div className="ornate-frame">
          <FrameCorners />
          <KitStar className="section-star" />
          <h2 className="display">
            <span className="flourish-wrap">
              <Flourish />
            </span>
            Every click is material.
            <span className="flourish-wrap flip">
              <Flourish />
            </span>
          </h2>
          <p className="subhead">
            We trace the whole show—from first impression to final checkout.
          </p>
          <div className="tickets">
            {TICKETS.map(({ label, src }) => (
              <article className="ticket" key={label}>
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
            ))}
          </div>
        </div>
      </section>

      <section className="stage tape-section">
        <StageDressing curtains={false} />
        <div className="stage-inner">
          <h2 className="display light">
            <span className="flourish-wrap">
              <Flourish />
            </span>
            Let’s review the tape.
            <span className="flourish-wrap flip">
              <Flourish />
            </span>
          </h2>
          <p className="subhead light">Your funnel. Our commentary.</p>
          <div className="tape">
            <FilmStrip />
            <div className="roasts">
              {TAPE_ROASTS.map((roast) => (
                <RoastCard key={roast.n} {...roast} />
              ))}
            </div>
          </div>
          <img className="audio-jack" src={kit.audioJack} alt="" />
        </div>
      </section>

      <section className="stage how-section" id="how">
        <div className="stage-inner">
          <MarqueeFrame>
            <h2 className="display gold">
              Three steps. Minimal emotional damage.
            </h2>
            <div className="steps">
              <div className="step">
                <img src={kit.iconDrop} alt="" />
                <p>1. Drop the link</p>
              </div>
              <div className="step">
                <img src={kit.iconTrace} alt="" />
                <p>2. We trace the funnel</p>
              </div>
              <div className="step">
                <img src={kit.iconRoast} alt="" />
                <p>3. Get the roast</p>
              </div>
            </div>
          </MarqueeFrame>
        </div>
      </section>

      <section className="parchment report-section" id="sample">
        <div className="ornate-frame report-grid">
          <FrameCorners />
          <div className="scoreboard">
            <h2 className="display">
              <span className="flourish-wrap">
                <Flourish />
              </span>
              The roast report.
              <span className="flourish-wrap flip">
                <Flourish />
              </span>
            </h2>
            <div className="score-row">
              <div>
                <p className="score">62 / 100</p>
                <p className="verdict">
                  Needs better material.
                  <img className="verdict-line" src={kit.scoreLine} alt="" />
                </p>
              </div>
              <ul className="heat">
                {SAMPLE_HEAT.map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <span className="peppers">
                      {Array.from({ length: PEPPER_SCALE }, (_, i) => i + 1).map(
                        (n) => (
                          <img
                            key={n}
                            src={n <= row.score ? kit.chiliOn : kit.chiliOff}
                            alt=""
                          />
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <article className="punch-card">
            <div className="punch-block">
              <h3>The punchline</h3>
              <KitStar className="mini-star" />
              <p>Your homepage has three headlines and none of them know each other.</p>
            </div>
            <div className="punch-block">
              <h3>The fix</h3>
              <KitStar className="mini-star" />
              <p>Choose one promise and make everything support it.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="stage finale" id="login">
        <StageDressing />
        <div className="stage-inner">
          <h2 className="display light finale-title">Ready to hear the truth?</h2>
          <RoastForm
            url={url}
            onUrl={setUrl}
            onSubmit={onRoast}
            button="Roast my funnel"
          />
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top">
          <img src="/assets/logo.png" alt="Roast My Funnel" />
        </a>
        <nav>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="#login">Log in</a>
        </nav>
      </footer>
    </div>
  );
}

function RoastForm({
  url,
  onUrl,
  onSubmit,
  button,
}: {
  url: string;
  onUrl: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  button: string;
}) {
  const id = useId();
  return (
    <form className="roast-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={id}>
        Store URL
      </label>
      <input
        id={id}
        type="url"
        required
        value={url}
        onChange={(e) => onUrl(e.target.value)}
        placeholder="https://tonal.com/"
      />
      <button type="submit">{button}</button>
    </form>
  );
}

function RoastCard({
  n,
  title,
  punch,
  note,
}: {
  n: number;
  title: string;
  punch: string;
  note: string;
}) {
  return (
    <div className="roast-item">
      <svg className="tape-lead" viewBox="0 0 72 24" aria-hidden="true">
        <path
          d="M70 16 C 42 16 24 6 8 8"
          fill="none"
          stroke="#c4922a"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path d="M0 8 L11 3.5 L11 12.5 Z" fill="#c4922a" />
      </svg>
      <article className="roast-card">
        <div className="roast-card-face">
          <span className="badge">{n}</span>
          <h3>{title}</h3>
          <div className="card-star">
            <KitStar />
          </div>
          <p className="punch">{punch}</p>
          <p className="fix">{note}</p>
        </div>
      </article>
    </div>
  );
}

function FilmStrip() {
  return (
    <div className="film">
      <div className="film-shots">
        <div className="film-shot">
          <div className="film-still">
            <img src="/assets/tape-ad.png" alt="Glow Co. Facebook ad" />
            <img className="mark circle" src={kit.redCircle} alt="" />
          </div>
        </div>
        <div className="film-shot">
          <div className="film-still">
            <img src="/assets/tape-landing.png" alt="Glow Co. landing page" />
            <img className="mark underline" src={kit.redUnderline} alt="" />
          </div>
        </div>
        <div className="film-shot">
          <div className="film-still">
            <img src="/assets/tape-checkout.png" alt="Glow Co. checkout" />
            <img className="mark circle shipping" src={kit.redCircle} alt="" />
          </div>
        </div>
      </div>
      <img className="film-overlay" src={kit.film} alt="" />
    </div>
  );
}

function MarqueeFrame({ children }: { children: ReactNode }) {
  return (
    <div className="marquee">
      <div className="marquee-edge top">
        <Bulbs count={14} />
      </div>
      <div className="marquee-edge right">
        <Bulbs count={6} />
      </div>
      <div className="marquee-edge bottom">
        <Bulbs count={14} />
      </div>
      <div className="marquee-edge left">
        <Bulbs count={6} />
      </div>
      <div className="marquee-inner">{children}</div>
    </div>
  );
}

function Bulbs({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <img
          key={i}
          className="bulb-img"
          src={i % 7 === 3 ? kit.bulbOff : kit.bulbOn}
          alt=""
        />
      ))}
    </>
  );
}
