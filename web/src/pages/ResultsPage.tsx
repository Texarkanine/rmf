import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Flourish, IconDetective, IconMasks, IconMic } from "../components/icons";
import { Grain, displayHost } from "../components/Grain";
import {
  FrameCorners,
  KitStar,
  StageDressing,
  kit,
} from "../kit";
import { scanPath, toFunnelUrl } from "../demoFunnel";
import { mockReport } from "../report/mockReport";
import {
  INTENSITY_LABELS,
  OWNER_BUTTON,
  QUEUE_LABELS,
} from "../report/labels";
import {
  buildWritersBrief,
  crowdKillers,
  findingById,
  markFixed,
  reopenTask,
  seedSetList,
  tapeShots,
  tasksIn,
  triageCards,
  withStoreUrl,
} from "../report/setList";
import type {
  CapturedAd,
  Finding,
  FunnelNode,
  Intensity,
  RoastReport,
  ScorecardColumn,
  ScorecardMetric,
  SetListCategory,
  SetListState,
} from "../report/types";

const TAPE_FINDING_IDS = ["f-promise", "f-accessories", "f-membership"] as const;

export function ResultsPage() {
  const [params] = useSearchParams();
  const report = useMemo(
    () => withStoreUrl(mockReport, toFunnelUrl(params.get("url"))),
    [params],
  );
  const host = displayHost(report.storeUrl);
  const scanUrl = scanPath(report.storeUrl);
  const [setList, setSetList] = useState(() => seedSetList(report.findings));
  const [toast, setToast] = useState<string | null>(null);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  }

  async function copyText(value: string, done: string) {
    try {
      await navigator.clipboard.writeText(value);
      flash(done);
    } catch {
      flash("Could not copy.");
    }
  }

  function exportReport() {
    const blob = new Blob(
      [JSON.stringify({ report, setList }, null, 2)],
      { type: "application/json" },
    );
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `roast-${host}.json`;
    a.click();
    URL.revokeObjectURL(href);
    flash("Report exported.");
  }

  return (
    <div className="page report-page">
      <Grain />
      <header className="site-header report-header">
        <Link className="brand" to="/">
          <img src="/assets/logo.png" alt="Roast My Funnel" />
        </Link>
        <nav className="nav" aria-label="Primary">
          <a href="#verdict">Report</a>
          <button
            type="button"
            className="text-nav"
            onClick={() => copyText(window.location.href, "Link copied.")}
          >
            Share
          </button>
          <button type="button" className="text-nav" onClick={exportReport}>
            Export
          </button>
          <span className="scan-pill">
            {host} · Scanned today
          </span>
        </nav>
      </header>

      <Verdict report={report} />
      <AdReel ad={report.ad} />
      <Funnel report={report} />
      <CrowdKillers report={report} />
      <Tape report={report} />
      <Scorecards columns={report.scorecards} />
      <SetList
        report={report}
        setList={setList}
        onToggle={(id) => {
          const task = setList.tasks.find((row) => row.id === id);
          if (!task) return;
          setSetList(
            task.status === "fixed" ? reopenTask(setList, id) : markFixed(setList, id),
          );
        }}
      />
      <Writers
        report={report}
        onCopy={() =>
          copyText(buildWritersBrief(report), "Implementation brief copied.")
        }
      />
      <Encore scanUrl={scanUrl} onShare={() => copyText(window.location.href, "Link copied.")} />

      {toast ? <p className="report-toast" role="status">{toast}</p> : null}
    </div>
  );
}

function Verdict({ report }: { report: RoastReport }) {
  return (
    <section className="stage report-hero" id="verdict">
      <StageDressing swag footlights />
      <div className="stage-inner report-hero-inner">
        <p className="scan-eyebrow">Live from the ad account</p>
        <h1 className="scan-title">Tonight’s verdict</h1>
        <p className="lede report-lede">{report.verdict}</p>
        <div className="rv-grid">
          <div className="rv-score">
            <p className="score rv-number">
              {report.overallScore} <span>/ 100</span>
            </p>
            <p className="verdict">
              {report.overallLabel}
              <img className="verdict-line" src={kit.scoreLine} alt="" />
            </p>
          </div>
          <ul className="rv-cats">
            {report.categories.map((row) => (
              <li key={row.id}>
                <span>{row.label}</span>
                <b>{row.score}</b>
              </li>
            ))}
          </ul>
          <article className="rv-leak">
            <p className="rv-kicker">Biggest leak</p>
            <KitStar className="mini-star" />
            <p>{report.leak}</p>
          </article>
        </div>
        <div className="rv-triage">
          {triageCards(report).map((card) => (
            <TriageCard key={card.title} title={card.title} note={card.note} />
          ))}
        </div>
        <p className="rv-badge">
          High confidence · {report.funnel.length}/{report.funnel.length} stages inspected
        </p>
      </div>
    </section>
  );
}

function TriageCard({ title, note }: { title: string; note: string }) {
  return (
    <article className="rv-chip">
      <h3>{title}</h3>
      <p>{note}</p>
    </article>
  );
}

function Funnel({ report }: { report: RoastReport }) {
  return (
    <section className="parchment report-block" id="funnel">
      <div className="ornate-frame">
        <FrameCorners />
        <SectionTitle>The funnel we found</SectionTitle>
        <p className="subhead">
          Facebook Ad → homepage → Tonal 2 → cart → checkout. We stop before payment.
        </p>
        <ol className="funnel-row">
          {report.funnel.map((node, index) => {
            const mismatch = report.mismatches.find(
              (row) => row.to === node.label,
            );
            return (
              <li key={node.id} className="funnel-step">
                {mismatch ? (
                  <p className="funnel-break" aria-hidden="true">
                    <span>✗</span> {mismatch.summary}
                  </p>
                ) : null}
                <FunnelNodeCard node={node} portrait={index === 0} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function FunnelNodeCard({
  node,
  portrait = false,
}: {
  node: FunnelNode;
  portrait?: boolean;
}) {
  return (
    <article className="funnel-node">
      <div className={`funnel-thumb${portrait ? " is-portrait" : ""}`}>
        {node.screenshot ? (
          <img src={node.screenshot} alt="" />
        ) : (
          <div className="funnel-placeholder">{node.label}</div>
        )}
      </div>
      <h3>{node.label}</h3>
      <p className="funnel-url">{node.url}</p>
      <p className="funnel-promise">{node.promise}</p>
      <p className="funnel-score">
        {node.score == null ? "Not inspected" : `${node.score} / 100`}
      </p>
    </article>
  );
}

function CrowdKillers({ report }: { report: RoastReport }) {
  const killers = crowdKillers(report);
  return (
    <section className="parchment report-block" id="crowd">
      <div className="ornate-frame">
        <FrameCorners />
        <SectionTitle>The three biggest crowd killers</SectionTitle>
        <div className="killers">
          {killers.map((finding, index) => (
            <article className="killer-card" key={finding.id}>
              <span className="badge">{index + 1}</span>
              <h3>{finding.title}</h3>
              <p>{finding.punchline}</p>
              <ul className="killer-tags">
                <Tag intensity={finding.impact} suffix="impact" />
                <Tag intensity={finding.effort} suffix="effort" />
                <Tag intensity={finding.confidence} suffix="confidence" />
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tag({ intensity, suffix }: { intensity: Intensity; suffix: string }) {
  return (
    <li>
      {INTENSITY_LABELS[intensity]} {suffix}
    </li>
  );
}

function AdReel({ ad }: { ad: CapturedAd }) {
  return (
    <section className="parchment report-block" id="ads">
      <div className="ornate-frame">
        <FrameCorners />
        <SectionTitle>The ad we captured</SectionTitle>
        <p className="subhead">
          <a href={ad.libraryUrl} target="_blank" rel="noreferrer">
            Library {ad.libraryId}
          </a>
          {" · "}Started {ad.started} · {ad.displayUrl}
        </p>
        <ol className="ad-reel">
          {ad.frames.map((frame) => (
            <li key={frame.label}>
              <figure className="ad-frame">
                <img src={frame.src} alt={`Ad frame at ${frame.label}`} />
                <figcaption>
                  <span>{frame.label}</span>
                  {frame.overlay ? <b>{frame.overlay}</b> : <b>No overlay</b>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <dl className="ad-copy">
          <div>
            <dt>Primary text</dt>
            <dd>{ad.primaryText}</dd>
          </div>
          <div>
            <dt>Headline</dt>
            <dd>{ad.headline}</dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>{ad.description}</dd>
          </div>
          <div>
            <dt>CTA</dt>
            <dd>
              {ad.cta} → {ad.destinationUrl}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Tape({ report }: { report: RoastReport }) {
  const cards = TAPE_FINDING_IDS.map((id) => findingById(report, id)).filter(
    (row): row is Finding => Boolean(row),
  );
  const shots = tapeShots(report);
  const tapeLabels = ["Ad to landing", "The bundle", "Checkout"];
  return (
    <section className="stage tape-section" id="tape">
      <StageDressing curtains={false} />
      <div className="stage-inner">
        <SectionTitle light>Let’s review the tape</SectionTitle>
        <p className="subhead light">Your funnel. Our commentary.</p>
        <div className="tape">
          <div className="film">
            <div className="film-shots">
              {shots.map((shot) => (
                <FilmShot
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  mark={shot.mark}
                />
              ))}
            </div>
            <img className="film-overlay" src={kit.film} alt="" />
          </div>
          <div className="roasts">
            {cards.map((finding, index) => (
              <div className="roast-item" key={finding.id}>
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
                    <span className="badge">{index + 1}</span>
                    <h3>{tapeLabels[index] ?? finding.title}</h3>
                    <div className="card-star">
                      <KitStar />
                    </div>
                    <p className="punch">{finding.punchline}</p>
                    <p className="fix">Fix: {finding.fix}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
        <img className="audio-jack" src={kit.audioJack} alt="" />
      </div>
    </section>
  );
}

function FilmShot({
  src,
  alt,
  mark,
}: {
  src: string;
  alt: string;
  mark: "circle" | "underline" | "shipping";
}) {
  return (
    <div className="film-shot">
      <div className="film-still">
        <img src={src} alt={alt} />
        <img
          className={`mark ${mark === "shipping" ? "circle shipping" : mark}`}
          src={mark === "underline" ? kit.redUnderline : kit.redCircle}
          alt=""
        />
      </div>
    </div>
  );
}

function Scorecards({ columns }: { columns: ScorecardColumn[] }) {
  return (
    <section className="parchment report-block" id="scorecard">
      <div className="ornate-frame">
        <FrameCorners />
        <SectionTitle>Stage-by-stage scorecard</SectionTitle>
        <div className="scorecard-grid">
          {columns.map((column) => (
            <article className="scorecard" key={column.id}>
              <h3>{column.title}</h3>
              <ul>
                {column.metrics.map((metric) => (
                  <li key={metric.label}>
                    <span>{metric.label}</span>
                    <Meter metric={metric} />
                  </li>
                ))}
              </ul>
              <p className="scorecard-key">
                <strong>Key finding.</strong> {column.keyFinding}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Meter({ metric }: { metric: ScorecardMetric }) {
  if (metric.kind === "chili") {
    return (
      <span className="peppers" aria-label={`${metric.value} of 5 heat`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <img
            key={n}
            src={n <= metric.value ? kit.chiliOn : kit.chiliOff}
            alt=""
          />
        ))}
      </span>
    );
  }
  return (
    <span className="star-row" aria-label={`${metric.value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <img
          key={n}
          className={n <= metric.value ? "star-on" : "star-off"}
          src={kit.star}
          alt=""
        />
      ))}
    </span>
  );
}

function SetList({
  report,
  setList,
  onToggle,
}: {
  report: RoastReport;
  setList: SetListState;
  onToggle: (id: string) => void;
}) {
  const columns: Array<{
    id: SetListCategory;
    icon: ReactNode;
  }> = [
    { id: "fix_now", icon: <IconMic /> },
    { id: "test_next", icon: <IconDetective /> },
    { id: "later", icon: <IconMasks /> },
  ];

  return (
    <section className="stage how-section" id="setlist">
      <div className="stage-inner report-set-inner">
        <MarqueeFrame>
          <SectionTitle light gold>
            Tonight’s set list
          </SectionTitle>
          <div className="set-cols">
            {columns.map((column) => (
              <div className="set-col" key={column.id}>
                <h3>
                  <span className="set-icon">{column.icon}</span>
                  {QUEUE_LABELS[column.id]}
                </h3>
                <ul>
                  {tasksIn(setList, column.id).map((task) => {
                    const finding = findingById(report, task.id);
                    if (!finding) return null;
                    return (
                      <li key={task.id} className={task.status === "fixed" ? "is-fixed" : ""}>
                        <label>
                          <input
                            type="checkbox"
                            checked={task.status === "fixed"}
                            onChange={() => onToggle(task.id)}
                          />
                          <span>{finding.fix}</span>
                        </label>
                        <span className="set-owner">{OWNER_BUTTON[finding.owner]}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </MarqueeFrame>
      </div>
    </section>
  );
}

function Writers({
  report,
  onCopy,
}: {
  report: RoastReport;
  onCopy: () => void;
}) {
  const headline = report.writersRoom[0];
  if (!headline) return null;
  return (
    <section className="parchment report-block" id="writers">
      <div className="ornate-frame writers-frame">
        <FrameCorners />
        <SectionTitle>The writers’ room</SectionTitle>
        <div className="writers-grid">
          <article className="writers-card">
            <p className="rv-kicker">Before</p>
            <p className="writers-copy">{headline.before}</p>
          </article>
          <img className="writers-arrow" src={kit.goldArrow} alt="" />
          <article className="writers-card after">
            <p className="rv-kicker">After</p>
            <p className="writers-copy">{headline.after}</p>
          </article>
          <div className="writers-fix">
            <p className="rv-kicker">The fix</p>
            <p>
              Keep the 3s overlay in the hero. Sell the complete system the ad
              showed. Put membership next to the $5,215 total. Do not make paid
              traffic tour the brand museum first.
            </p>
            <button className="scan-cta writers-cta" type="button" onClick={onCopy}>
              Copy implementation brief
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Encore({
  scanUrl,
  onShare,
}: {
  scanUrl: string;
  onShare: () => void;
}) {
  return (
    <section className="stage finale" id="encore">
      <StageDressing swag footlights />
      <div className="stage-inner">
        <div className="hero-mark small">
          <img src="/assets/logo-mark.png" alt="" />
        </div>
        <h2 className="display light finale-title">Ready for your encore?</h2>
        <p className="lede">Fix the material. Then let us roast it again.</p>
        <Link className="scan-cta" to={scanUrl}>
          Roast me again
        </Link>
        <p className="tagline italic">
          <button type="button" className="text-nav light" onClick={onShare}>
            Share report
          </button>
        </p>
      </div>
    </section>
  );
}

function SectionTitle({
  children,
  light = false,
  gold = false,
}: {
  children: ReactNode;
  light?: boolean;
  gold?: boolean;
}) {
  const cls = ["display", light ? "light" : "", gold ? "gold" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <h2 className={cls}>
      <span className="flourish-wrap">
        <Flourish />
      </span>
      {children}
      <span className="flourish-wrap flip">
        <Flourish />
      </span>
    </h2>
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
