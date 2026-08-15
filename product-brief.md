# Roast My Funnel

A tongue-in-cheek roast of a paid-acquisition path: a real ad, then the site, up to intent to purchase. Judges see a short walk video and a pithy HTML report.

## Who it is for

Someone spending money on Meta or Google who wants to know where the funnel leaks, without a 20-page CRO memo.

## What the user provides

1. Landing page URL
2. Whether they advertise on Meta or Google
3. Monthly ad spend (roast ammunition, not a ROAS model)
4. A deep link to a specific ad in the Meta Ad Library or Google Ads Transparency Center, so we can confirm access and save ad copy to disk before anyone walks the site

## What the skill does

1. Save the ad (copy, CTA, destination, creative) to disk.
2. Walk the site in Cursor’s in-app browser from the landing page to a visible payment form. Do not submit payment. Do not invent a card. Account walls at checkout are in scope; earlier login walls are out.
3. At each step, fork an analysis subagent (slobac-style: write findings to disk, return metadata only). Join them before the report. The walker only walks.
4. Hook [marketingskills](https://github.com/coreyhaines31/marketingskills) at the matching step as reference, not as an interview. Ad-vs-landing mismatch lives in this skill; Corey’s repo does not have it.

## Iteration target

- Site: [tonal.com](https://tonal.com/)
- Ad: [Meta Ad Library `2110273689844971`](https://www.facebook.com/ads/library/?id=2110273689844971)

Tape this blessed pair. “Any URL” is the story; this pair is the demo.

## Demo shape

Install from a repo marketplace. Run `roast-my-funnel`. Output is a pretty HTML roast. The walk video is the hackathon tape, not a product artifact.
