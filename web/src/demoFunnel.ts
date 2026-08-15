/** The only live demo funnel. Every grill path opens this report. */
export const DEMO_FUNNEL_URL = "https://tonal.com/";

export function toFunnelUrl(_input?: string | null): string {
  return DEMO_FUNNEL_URL;
}

export function scanPath(input?: string | null): string {
  return `/scan?url=${encodeURIComponent(toFunnelUrl(input))}`;
}

export function resultsPath(input?: string | null): string {
  return `/results?url=${encodeURIComponent(toFunnelUrl(input))}`;
}
