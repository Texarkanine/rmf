import type { ConsoleMessage, Page, Request, Response } from "@playwright/test";

export interface PageObservers {
  consoleErrors: string[];
  networkErrors: string[];
  redirects: string[];
  dispose: () => void;
}

export function attachObservers(page: Page): PageObservers {
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];
  const redirects: string[] = [];

  const onConsole = (message: ConsoleMessage) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  };
  const onResponse = (response: Response) => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} ${response.url()}`);
    }
    const from = response.request().redirectedFrom();
    if (from) {
      redirects.push(`${from.url()} -> ${response.url()}`);
    }
  };
  const onFail = (request: Request) => {
    networkErrors.push(`FAILED ${request.url()} ${request.failure()?.errorText ?? ""}`);
  };

  page.on("console", onConsole);
  page.on("response", onResponse);
  page.on("requestfailed", onFail);

  return {
    consoleErrors,
    networkErrors,
    redirects,
    dispose: () => {
      page.off("console", onConsole);
      page.off("response", onResponse);
      page.off("requestfailed", onFail);
    },
  };
}

export function snapshotAndClear(observers: PageObservers): {
  consoleErrors: string[];
  networkErrors: string[];
  redirects: string[];
} {
  const snapshot = {
    consoleErrors: [...observers.consoleErrors],
    networkErrors: [...observers.networkErrors],
    redirects: [...observers.redirects],
  };
  observers.consoleErrors.length = 0;
  observers.networkErrors.length = 0;
  observers.redirects.length = 0;
  return snapshot;
}
