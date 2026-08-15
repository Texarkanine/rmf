import type { CaptureBundle, FunnelIntent, StageName } from "../types.js";

export interface FunnelStep {
  name: StageName;
  url: string;
  intents: FunnelIntent[];
  paymentUiDetected: boolean;
  screenshot: string;
}

export interface StepsFile {
  startUrl: string;
  stoppedBeforePayment: true;
  steps: FunnelStep[];
}

/**
 * Slim hop list for chat and later pipeline steps. Not a grade.
 */
export function toSteps(bundle: CaptureBundle): StepsFile {
  return {
    startUrl: bundle.meta.startUrl,
    stoppedBeforePayment: bundle.stoppedBeforePayment,
    steps: bundle.stages.map((stage) => ({
      name: stage.name,
      url: stage.url,
      intents: stage.timings.interactions.map((item) => item.intent),
      paymentUiDetected: stage.paymentUiDetected,
      screenshot: stage.screenshot,
    })),
  };
}
