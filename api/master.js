export default async function handler(req, res) {
  const ALLOWED = "https://bd71.vercel.app";

  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  // SECURITY CHECK
  if (!origin.startsWith(ALLOWED) || !referer.startsWith(ALLOWED)) {
    res.setHeader("Content-Type", "text/html");
    return res.status(403).send(`
      <html>
        <head><title>Access Denied</title></head>
        <body style="font-family:Arial; text-align:center; padding-top:50px;">
          <h1 style="color:red;">⛔ Access Denied</h1>
          <p>This stream is protected and only works from:</p>
          <h3>${ALLOWED}</h3>
        </body>
      </html>
    `);
  }

  try {
    const url = req.query.u
      ? decodeURIComponent(req.query.u)
      : "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

    const r = await fetch(url);
    if (!r.ok) return res.status(502).send("Bad Source Playlist");

    const text = await r.text();
    const base = url.replace(/[^/]+$/, "");

    const rewritten = text.split("\n").map(line => {
      const t = line.trim();
      if (!t || t.startsWith("#")) return line;

      const abs = new URL(t, base).href;

      if (abs.endsWith(".m3u8")) {
        return `/api/master?u=${encodeURIComponent(abs)}`;
      }
      if (abs.endsWith(".ts")) {
        return `/api/segment?u=${encodeURIComponent(abs)}`;
      }

      return line;
    }).join("\n");

    res.setHeader("Access-Control-Allow-Origin", ALLOWED);
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    return res.send(rewritten);

  } catch (err) {
    return res.status(500).send("Playlist Error");
  }
}
