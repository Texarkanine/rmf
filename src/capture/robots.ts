export interface RobotsRules {
  allow: string[];
  disallow: string[];
}

interface RobotsGroup {
  agents: string[];
  allow: string[];
  disallow: string[];
}

export function parseRobots(text: string, userAgent = "*"): RobotsRules {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/#.*$/, "").trim());
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup = { agents: [], allow: [], disallow: [] };

  const flush = () => {
    if (current.agents.length > 0) {
      groups.push(current);
    }
    current = { agents: [], allow: [], disallow: [] };
  };

  for (const line of lines) {
    if (!line) {
      continue;
    }
    const colon = line.indexOf(":");
    if (colon < 0) {
      continue;
    }
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (current.allow.length > 0 || current.disallow.length > 0) {
        flush();
      }
      current.agents.push(value.toLowerCase());
    } else if (key === "allow") {
      current.allow.push(value);
    } else if (key === "disallow") {
      current.disallow.push(value);
    }
  }
  flush();

  const ua = userAgent.toLowerCase();
  const matching = groups.filter(
    (group) => group.agents.includes(ua) || group.agents.includes("*"),
  );
  const specific = matching.filter((group) => group.agents.includes(ua) && ua !== "*");
  const chosen = specific.length > 0 ? specific : matching;

  return {
    allow: chosen.flatMap((group) => group.allow),
    disallow: chosen.flatMap((group) => group.disallow),
  };
}

export function isPathAllowed(rules: RobotsRules, pathname: string): boolean {
  let best: { length: number; type: "allow" | "disallow" } | undefined;

  const consider = (pattern: string, type: "allow" | "disallow") => {
    if (pattern === "") {
      return;
    }
    if (!pathname.startsWith(pattern)) {
      return;
    }
    if (!best || pattern.length > best.length) {
      best = { length: pattern.length, type };
      return;
    }
    if (pattern.length === best.length && type === "allow") {
      best = { length: pattern.length, type };
    }
  };

  for (const pattern of rules.disallow) {
    consider(pattern, "disallow");
  }
  for (const pattern of rules.allow) {
    consider(pattern, "allow");
  }

  if (!best) {
    return true;
  }
  return best.type === "allow";
}

export async function assertUrlAllowed(url: string): Promise<void> {
  const target = new URL(url);
  const robotsUrl = new URL("/robots.txt", target.origin).href;
  let text = "";
  try {
    const response = await fetch(robotsUrl);
    if (response.ok) {
      text = await response.text();
    }
  } catch {
    return;
  }
  if (!text) {
    return;
  }
  const rules = parseRobots(text, "RmfAuditor");
  if (!isPathAllowed(rules, target.pathname || "/")) {
    throw new Error(`robots.txt disallows crawling ${target.href}`);
  }
}
