import { Link, useSearchParams } from "react-router-dom";
import { Grain, displayHost } from "../components/Grain";
import { StageDressing } from "../kit";

export function ResultsPage() {
  const [params] = useSearchParams();
  const host = displayHost(params.get("url"));

  return (
    <div className="page scan-page">
      <Grain />
      <header className="site-header">
        <Link className="brand" to="/">
          <img src="/assets/logo.png" alt="Roast My Funnel" />
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link to="/">Lobby</Link>
          <Link className="ghost" to={`/scan?url=${encodeURIComponent(params.get("url") || "")}`}>
            Scan again
          </Link>
        </nav>
      </header>
      <section className="stage scan-stage">
        <StageDressing swag footlights />
        <div className="stage-inner">
          <p className="scan-eyebrow">Next up</p>
          <div className="hero-mark">
            <img src="/assets/logo-mark.png" alt="" />
          </div>
          <h1 className="scan-title">Your roast report.</h1>
          <p className="lede">
            <span className="scan-host">{host}</span> made it through the scan.
            The full report page is next.
          </p>
          <Link className="scan-cta" to="/">
            Back to the lobby
          </Link>
        </div>
      </section>
    </div>
  );
}
