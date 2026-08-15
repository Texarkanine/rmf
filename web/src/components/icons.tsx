import { useId, type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function svgProps(props: IconProps) {
  const { title, ...rest } = props;
  return rest;
}

export function LogoMark({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" aria-hidden={!title} {...svgProps(props)}>
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="24" cy="13" rx="10" ry="9" />
        <path d="M16 10.5h16M16 13h16M16 15.5h16" opacity="0.7" />
        <path d="M24 22v5" />
        <path d="M12 28h24l-5 26H17z" />
        <path d="M20 54v6h8v-6" />
        <path d="M16 60h16" />
      </g>
    </svg>
  );
}

export function Flourish({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 120 18" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M2 9c18 0 18-6 38-6 8 0 12 3 20 6-8 3-12 6-20 6-20 0-20-6-38-6z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M60 9h58"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="9" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Star({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...svgProps(props)}>
      <path
        fill="currentColor"
        d="M12 1.8l2.4 7.2h7.6l-6.1 4.5 2.3 7.2L12 16.4 5.8 20.7l2.3-7.2L2 9h7.6L12 1.8z"
      />
    </svg>
  );
}

export function Chili({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 28" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M13 3.5c.2 2.4-1 3.8-2.8 4.2"
        fill="none"
        stroke={filled ? "#3d6b28" : "#c9bba6"}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.6 8.2c-4.2.8-7.4 6.4-6.2 11.4 1 4.2 5.2 6.6 8.6 5.2 3.6-1.4 6.4-7 5.2-11.4C17.4 10.4 14.8 8.6 12 8.8c-.6 1.6-2.2 2.4-3.8 1.8"
        fill={filled ? "#c23028" : "none"}
        stroke={filled ? "#8b1e1a" : "#c9bba6"}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMegaphone({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M12 28v8c0 2 1.4 4 4.2 4.6L22 42V26l-5.8 1.4C13.4 28 12 26.6 12 28z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M22 18l30-8v44L22 46V18z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M28 24v16M36 21.5v21" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M22 42.5c1.4 6 5.2 10.5 9.4 10.5 3.2 0 4.6-2.4 3.6-5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBrowser({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svgProps(props)}>
      <rect x="8" y="12" width="48" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8 22h48" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="1.6" fill="currentColor" />
      <circle cx="22" cy="17" r="1.6" fill="currentColor" />
      <circle cx="28" cy="17" r="1.6" fill="currentColor" />
      <path d="M18 32h28M18 40h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTag({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M34 12H14v20L34 52l20-20-20-20z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="22" r="3.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconCart({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M10 16h8l4.5 24H48l6-16H22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="28" cy="50" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="46" cy="50" r="3.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconCard({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...svgProps(props)}>
      <rect x="8" y="18" width="48" height="30" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M8 26h48" stroke="currentColor" strokeWidth="2" />
      <path d="M14 38h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="42" y="34" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M44 32v-2a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconMic({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" {...svgProps(props)}>
      <ellipse cx="40" cy="22" rx="14" ry="13" stroke="currentColor" strokeWidth="2.2" />
      <path d="M30 22h20M40 35v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M28 18c1.6 3 4.2 5 12 5s10.4-2 12-5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M26 43h28L49 66H31z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M35 66v6h10v-6" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function IconDetective({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M16 30c8-10 14-14 24-14s16 4 24 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M12 30h56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M24 32c1 12 7 18 16 18s15-6 16-18"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="M34 42c2 2 4 3 6 3s4-1 6-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="56" cy="52" r="12" stroke="currentColor" strokeWidth="2.2" />
      <path d="M64.5 60.5 74 70" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMasks({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M10 28c2-10 12-16 22-14 8 2 14 10 14 20 0 10-6 22-16 24-10 2-20-6-22-16-1-4 0-10 2-14z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path d="M18 34c1.4-2 3.4-3 5.6-3s4 1 5.4 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 34c1.2-2 3-3 5.2-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 48c4 4 10 4 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M38 30c4-10 14-14 24-10 8 3 14 12 12 22-2 10-10 20-20 20-12 0-20-10-18-22 1-4 1-8 2-10z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path d="M48 36c1.2-2 3-3 5-3s4 1 5.2 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M62 38c1-1.6 2.6-2.4 4.4-2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 52c3-4 10-5 14-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Curtains() {
  const uid = useId().replace(/:/g, "");
  return (
    <div className="curtains" aria-hidden="true">
      <CurtainSide className="curtain left" uid={`${uid}-l`} />
      <CurtainSide className="curtain right" uid={`${uid}-r`} />
    </div>
  );
}

function CurtainSide({ className, uid }: { className: string; uid: string }) {
  const velvet = `${uid}-velvet`;
  const swag = `${uid}-swag`;
  return (
    <svg className={className} viewBox="0 0 220 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id={velvet} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a0504" />
          <stop offset="7%" stopColor="#6e1410" />
          <stop offset="14%" stopColor="#3a0806" />
          <stop offset="22%" stopColor="#8a1f18" />
          <stop offset="30%" stopColor="#4a0b08" />
          <stop offset="38%" stopColor="#7a1814" />
          <stop offset="46%" stopColor="#2e0605" />
          <stop offset="55%" stopColor="#9a2a20" />
          <stop offset="64%" stopColor="#4c0c0a" />
          <stop offset="73%" stopColor="#731510" />
          <stop offset="82%" stopColor="#2a0504" />
          <stop offset="90%" stopColor="#5c100c" />
          <stop offset="100%" stopColor="#1a0302" />
        </linearGradient>
        <linearGradient id={swag} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a33228" />
          <stop offset="40%" stopColor="#5a100c" />
          <stop offset="100%" stopColor="#2a0504" />
        </linearGradient>
      </defs>
      <path
        d="M0 0 H170 C150 80 175 160 140 260 C175 380 125 520 155 680 C130 780 160 850 140 900 H0 Z"
        fill={`url(#${velvet})`}
      />
      <path
        d="M0 0 H210 C150 12 100 55 86 120 C58 62 20 20 0 0 Z"
        fill={`url(#${swag})`}
      />
      <path
        d="M0 0 H170 C150 80 175 160 140 260 C175 380 125 520 155 680 C130 780 160 850 140 900"
        fill="none"
        stroke="#1a0302"
        strokeWidth="6"
        opacity="0.35"
      />
    </svg>
  );
}

export function AudioJack({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 220 40" fill="none" aria-hidden="true" {...svgProps(props)}>
      <path
        d="M8 28c40-22 80-22 120 0 20 10 40 10 70 2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="188" y="14" width="26" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M214 17v6M208 16v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Bottle({ ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 80" aria-hidden="true" {...svgProps(props)}>
      <rect x="18" y="4" width="12" height="8" rx="1" fill="#c9a36a" />
      <path d="M16 12h16l-2 8H18z" fill="#d9c4a0" />
      <rect x="12" y="20" width="24" height="52" rx="8" fill="#e8d5b5" />
      <rect x="12" y="20" width="24" height="16" rx="8" fill="#d4b896" />
      <circle cx="24" cy="46" r="6" fill="#c9a36a" opacity="0.5" />
    </svg>
  );
}
