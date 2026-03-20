import type { RecorderAction, ElementInfo } from "../types"

export function buildRecorderScript(actions: RecorderAction[]): string {
  const replayCode = actions
    .map((action, i) => {
      switch (action.type) {
        case "click":
          return `
          // Replay action ${i + 1}: click
          try {
            await page.waitForSelector(${JSON.stringify(action.selector)}, { timeout: 5000 });
            await Promise.all([
              page.click(${JSON.stringify(action.selector)}),
              page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {}),
            ]);
          } catch(e) {}
          await page.waitForTimeout(1000);
        `
        case "fill":
          return `
          // Replay action ${i + 1}: fill
          try {
            await page.waitForSelector(${JSON.stringify(action.selector)}, { timeout: 5000 });
            await page.type(${JSON.stringify(action.selector)}, ${JSON.stringify(action.value || "")});
            await page.waitForTimeout(500);
          } catch {}
        `
        case "scroll":
          return `
          // Replay action ${i + 1}: scroll
          try {
            await page.evaluate((scrollValue) => {
              if (scrollValue === "bottom") {
                window.scrollTo(0, document.body.scrollHeight);
              } else {
                window.scrollBy(0, parseInt(scrollValue) || 500);
              }
            }, ${JSON.stringify(action.value || "500")});
            await page.waitForTimeout(1000);
          } catch {}
        `
        case "wait":
          return `
          // Replay action ${i + 1}: wait
          await page.waitForTimeout(${Math.min(parseInt(action.value || "2000"), 5000)});
        `
        default:
          return `// Replay action ${i + 1}: unknown (skipped)`
      }
    })
    .join("\n")

  return `
    module.exports = async ({ page, context }) => {
      try {
        await page.goto(context.url, { waitUntil: 'networkidle2', timeout: 30000 });

        ${replayCode}

        const elements = await page.evaluate(() => {
          const SELECTORS = 'a, button, input, select, textarea, [role="button"], img, h1, h2, h3, h4, h5, h6, p, span, li, td, th, label';
          const els = Array.from(document.querySelectorAll(SELECTORS));
          const results = [];

          for (const el of els) {
            if (results.length >= 200) break;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const tag = el.tagName.toLowerCase();
            let selector = '';
            const testId = el.getAttribute('data-testid');
            if (testId) {
              selector = '[data-testid="' + testId + '"]';
            } else if (el.id) {
              selector = '#' + el.id;
            } else if (el.className && typeof el.className === 'string' && el.className.trim()) {
              const cls = el.className.trim().split(/\\s+/).join('.');
              selector = tag + '.' + cls;
              if (document.querySelectorAll(selector).length > 1) {
                const parent = el.parentElement;
                if (parent) {
                  const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
                  const idx = siblings.indexOf(el) + 1;
                  selector = tag + ':nth-of-type(' + idx + ')';
                  const parentTag = parent.tagName.toLowerCase();
                  if (parent.id) {
                    selector = '#' + parent.id + ' > ' + selector;
                  } else if (parent.className && typeof parent.className === 'string' && parent.className.trim()) {
                    selector = parentTag + '.' + parent.className.trim().split(/\\s+/).join('.') + ' > ' + selector;
                  }
                }
              }
            } else {
              const parent = el.parentElement;
              if (parent) {
                const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
                const idx = siblings.indexOf(el) + 1;
                selector = tag + ':nth-of-type(' + idx + ')';
              } else {
                selector = tag;
              }
            }

            const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
            const isInteractive = interactiveTags.includes(tag) || el.getAttribute('role') === 'button';

            let type = 'container';
            if (tag === 'a') type = 'link';
            else if (tag === 'button' || el.getAttribute('role') === 'button') type = 'button';
            else if (tag === 'input' || tag === 'select' || tag === 'textarea') type = 'input';
            else if (tag === 'img') type = 'image';
            else if (['h1','h2','h3','h4','h5','h6','p','span','label','li','td','th'].includes(tag)) type = 'text';

            const text = (el.textContent || '').trim().substring(0, 100);

            results.push({
              selector,
              tagName: tag,
              text,
              rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
              isInteractive,
              type,
            });
          }

          return results;
        });

        const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' });
        const pageTitle = await page.title();
        const currentUrl = page.url();

        return {
          screenshot: 'data:image/png;base64,' + screenshot,
          elements,
          currentUrl,
          pageTitle,
        };
      } catch (error) {
        throw new Error('Recorder session failed: ' + error.message);
      }
    };
  `
}

export async function executeRecorderSession(
  url: string,
  actions: RecorderAction[]
): Promise<{
  screenshot: string
  elements: ElementInfo[]
  currentUrl: string
  pageTitle: string
}> {
  const browserlessUrl = process.env.BROWSERLESS_URL
  const browserlessToken = process.env.BROWSERLESS_TOKEN
  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless not configured")
  }

  const script = buildRecorderScript(actions)

  const response = await fetch(
    `${browserlessUrl}/function?token=${browserlessToken}&stealth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: script,
        context: { url, actions },
      }),
      signal: AbortSignal.timeout(55000),
    }
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(`Browserless error (${response.status}): ${errorText.slice(0, 200)}`)
  }

  const text = await response.text()
  if (!text || text.trim().length === 0) {
    throw new Error("Browserless returned empty response. The browser function may have timed out or crashed.")
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Browserless returned invalid JSON: ${text.slice(0, 200)}`)
  }
}
