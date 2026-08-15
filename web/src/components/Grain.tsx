export function Grain() {
  return (
    <svg className="grain-svg" aria-hidden="true">
      <filter id="page-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
    </svg>
  );
}

export function displayHost(value: string | null | undefined) {
  if (!value) return "your store";
  try {
    const host = new URL(value).host.replace(/^www\./, "");
    return host || "your store";
  } catch {
    const stripped = value.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return stripped || "your store";
  }
}
