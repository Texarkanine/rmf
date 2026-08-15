export const kit = {
  curtain: "/kit/stage/curtain-left.png",
  swag: "/kit/stage/curtain-swag.png",
  spotlight: "/kit/stage/spotlight-dust.png",
  footlights: "/kit/stage/hero-footlights.png",
  parchment: "/kit/textures/parchment-texture.png",
  grain: "/kit/textures/stage-grain.png",
  brick: "/kit/textures/comedy-club-brick.png",
  ticket: "/kit/tickets/ticket-stub.png",
  roastCard: "/kit/tickets/roast-card-frame.png",
  punch: "/kit/report/punch-ticket.png",
  star: "/kit/ornaments/gold-star.png",
  corner: "/kit/ornaments/ornate-corner.png",
  audioJack: "/kit/ornaments/audio-jack.png",
  film: "/kit/filmstrip/film-strip.png",
  redCircle: "/kit/filmstrip/red-circle.png",
  redUnderline: "/kit/filmstrip/red-underline.png",
  goldArrow: "/kit/filmstrip/gold-arrow.png",
  bulbOn: "/kit/marquee/marquee-bulb-on.png",
  bulbOff: "/kit/marquee/marquee-bulb-off.png",
  chiliOn: "/kit/report/chili-filled.png",
  chiliOff: "/kit/report/chili-empty.png",
  scoreLine: "/kit/report/score-underline.png",
  iconAds: "/kit/icons/icon-ads.png",
  iconProduct: "/kit/icons/icon-product.png",
  iconCart: "/kit/icons/icon-cart.png",
  iconCheckout: "/kit/icons/icon-checkout.png",
  iconDrop: "/kit/marquee/icon-drop-link.png",
  iconTrace: "/kit/marquee/icon-trace-funnel.png",
  iconRoast: "/kit/marquee/icon-get-roast.png",
} as const;

export function KitStar({ className = "" }: { className?: string }) {
  return <img className={`kit-star ${className}`} src={kit.star} alt="" />;
}

export function FrameCorners() {
  return (
    <>
      <img className="frame-corner tl" src={kit.corner} alt="" />
      <img className="frame-corner tr" src={kit.corner} alt="" />
      <img className="frame-corner bl" src={kit.corner} alt="" />
      <img className="frame-corner br" src={kit.corner} alt="" />
    </>
  );
}

export function StageDressing({
  swag = false,
  footlights = false,
}: {
  swag?: boolean;
  footlights?: boolean;
}) {
  return (
    <>
      {swag ? (
        <img className="curtain-swag" src={kit.swag} alt="" aria-hidden="true" />
      ) : null}
      <div className="curtains" aria-hidden="true">
        <img className="curtain left" src={kit.curtain} alt="" />
        <img className="curtain right" src={kit.curtain} alt="" />
      </div>
      <img className="spotlight-dust" src={kit.spotlight} alt="" aria-hidden="true" />
      {footlights ? (
        <img className="footlights" src={kit.footlights} alt="" aria-hidden="true" />
      ) : null}
    </>
  );
}
