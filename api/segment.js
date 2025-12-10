export default async function handler(req, res) {
  const ALLOWED = "https://bd71.vercel.app";

  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (!origin.startsWith(ALLOWED) || !referer.startsWith(ALLOWED)) {
    return res.status(403).json({ error: "Forbidden: Invalid Origin or Referer" });
  }

  const url = req.query.u;
  if (!url) return res.status(400).json({ error: "Missing segment URL" });

  try {
    const segment = await fetch(url);
    const buffer = await segment.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", ALLOWED);
    res.setHeader("Content-Type", "video/mp2t");
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch segment" });
  }
      }
