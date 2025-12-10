export default async function handler(req, res) {
  const ALLOWED = "https://bd71.vercel.app";

  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (!origin.startsWith(ALLOWED) || !referer.startsWith(ALLOWED)) {
    res.setHeader("Content-Type", "text/html");
    return res.status(403).send(`
      <html>
        <head><title>Access Denied</title></head>
        <body style="font-family:Arial; text-align:center; padding-top:50px;">
          <h1 style="color:red;">⛔ Access Denied</h1>
          <p>Segment access blocked. Allowed domain:</p>
          <h3>${ALLOWED}</h3>
        </body>
      </html>
    `);
  }

  const url = req.query.u;
  if (!url) return res.status(400).send("Missing ts url");

  try {
    const r = await fetch(decodeURIComponent(url));
    if (!r.ok) return res.status(502).send("Segment Error");

    const buffer = Buffer.from(await r.arrayBuffer());

    res.setHeader("Access-Control-Allow-Origin", ALLOWED);
    res.setHeader("Content-Type", "video/mp2t");
    return res.send(buffer);

  } catch (err) {
    return res.status(500).send("Segment Proxy Error");
  }
}
