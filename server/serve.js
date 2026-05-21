/**
 * Standalone production server for Expo static builds.
 *
 * Serves the output of build.js (static-build/) with two special routes:
 * - GET / or /manifest with expo-platform header → platform manifest JSON
 * - GET / without expo-platform → landing page HTML
 * Everything else falls through to static file serving from ./static-build/.
 *
 * Zero external dependencies — uses only Node.js built-ins (http, fs, path).
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

const STATIC_ROOT = path.resolve(__dirname, "..", "static-build");
const TEMPLATE_PATH = path.resolve(__dirname, "templates", "landing-page.html");
const basePath = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
};

function getAppName() {
  try {
    const appJsonPath = path.resolve(__dirname, "..", "app.json");
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function serveManifest(platform, res) {
  const manifestPath = path.join(STATIC_ROOT, platform, "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ error: `Manifest not found for platform: ${platform}` }),
    );
    return;
  }

  const manifest = fs.readFileSync(manifestPath, "utf-8");
  res.writeHead(200, {
    "content-type": "application/json",
    "expo-protocol-version": "1",
    "expo-sfv-version": "0",
  });
  res.end(manifest);
}

function serveLandingPage(req, res, landingPageTemplate, appName) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  const baseUrl = `${protocol}://${host}`;
  const expsUrl = `${host}`;

  const html = landingPageTemplate
    .replace(/BASE_URL_PLACEHOLDER/g, baseUrl)
    .replace(/EXPS_URL_PLACEHOLDER/g, expsUrl)
    .replace(/APP_NAME_PLACEHOLDER/g, appName);

  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(html);
}

function serveStaticFile(urlPath, res) {
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = path.join(STATIC_ROOT, safePath);

  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, { "content-type": contentType });
  res.end(content);
}

const landingPageTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
const appName = getAppName();

async function handleAIRequest(req, res) {
  if (!ANTHROPIC_API_KEY) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", async () => {
    try {
      const { prompt, systemPrompt } = JSON.parse(body);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ text }));
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "AI request failed" }));
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || "/";
  }

  if (req.method === "POST" && pathname === "/api/ai/analyze") {
    return handleAIRequest(req, res);
  }

  if (req.method === "POST" && pathname === "/api/chat") {
    if (!ANTHROPIC_API_KEY) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }));
      return;
    }
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", async () => {
      try {
        const { messages } = JSON.parse(body);
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: "You are CaseBuilder AI, a helpful legal case organization assistant. You provide informational support only, never legal advice. Always recommend consulting a licensed lawyer for specific legal questions.",
            messages,
          }),
        });
        const data = await response.json();
        const reply = data.content?.[0]?.text || "";
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ reply }));
      } catch {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Chat request failed" }));
      }
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/analysis-log") {
    req.resume();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === "POST" && pathname === "/api/promo/redeem") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const { code } = JSON.parse(body);
        const PROMO_CODES = JSON.parse(process.env.PROMO_CODES || "{}");
        const promo = PROMO_CODES[code?.toUpperCase()];
        if (!promo) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ valid: false, error: "Invalid promo code" }));
          return;
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ valid: true, expiresAt: promo.expiresAt, label: promo.label }));
      } catch {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ valid: false, error: "Invalid request" }));
      }
    });
    return;
  }

  if (req.method === "GET" && pathname === "/privacy") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Privacy Policy — CaseBuilder AI</title><style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1a1a2e}h1{color:#0D1F35}h2{color:#1F6F78}a{color:#1F6F78}</style></head><body>
<h1>Privacy Policy</h1>
<p><strong>Last updated: May 2026</strong></p>
<p>CaseBuilder AI ("we", "our", or "us") is committed to protecting your privacy. This policy explains how we handle your information.</p>
<h2>Data Storage</h2>
<p>All case data, evidence, timelines, and notes you enter are stored <strong>locally on your device only</strong>. We do not upload, transmit, or store your case information on any server.</p>
<h2>AI Features</h2>
<p>When you use AI Chat or AI Analysis features, your messages are sent to our secure server to generate a response using the Anthropic API. These messages are not stored or logged.</p>
<h2>Payments</h2>
<p>Subscriptions are processed by Apple via In-App Purchase. We do not collect or store payment information.</p>
<h2>Analytics</h2>
<p>We do not use third-party analytics or advertising SDKs. We do not track you across apps or websites.</p>
<h2>Contact</h2>
<p>Questions? Email us at <a href="mailto:support@casebuilderai.com">support@casebuilderai.com</a></p>
</body></html>`);
    return;
  }

  if (req.method === "GET" && pathname === "/terms") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Terms of Use — CaseBuilder AI</title><style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1a1a2e}h1{color:#0D1F35}h2{color:#1F6F78}a{color:#1F6F78}</style></head><body>
<h1>Terms of Use</h1>
<p><strong>Last updated: May 2026</strong></p>
<p>By using CaseBuilder AI, you agree to these terms. Please read them carefully.</p>
<h2>Not Legal Advice</h2>
<p>CaseBuilder AI is not a law firm and does not provide legal advice. All information is for organizational and informational purposes only. Always consult a licensed attorney for legal matters.</p>
<h2>Subscription</h2>
<p>CaseBuilder AI offers a $2.99/month subscription with a 7-day free trial. Subscriptions auto-renew unless cancelled. Manage or cancel anytime in your App Store settings.</p>
<h2>Acceptable Use</h2>
<p>You agree to use CaseBuilder AI only for lawful purposes and not to misuse the AI features.</p>
<h2>Limitation of Liability</h2>
<p>CaseBuilder AI is provided "as is". We are not liable for any outcomes related to your legal situation.</p>
<h2>Contact</h2>
<p>Questions? Email us at <a href="mailto:support@casebuilderai.com">support@casebuilderai.com</a></p>
<p>This app is subject to Apple's Standard EULA: <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">https://www.apple.com/legal/internet-services/itunes/dev/stdeula/</a></p>
</body></html>`);
    return;
  }

  if (pathname === "/" || pathname === "/manifest") {
    const platform = req.headers["expo-platform"];
    if (platform === "ios" || platform === "android") {
      return serveManifest(platform, res);
    }

    if (pathname === "/") {
      return serveLandingPage(req, res, landingPageTemplate, appName);
    }
  }

  serveStaticFile(pathname, res);
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving static Expo build on port ${port}`);
});
