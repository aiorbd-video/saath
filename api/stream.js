export default async function handler(req, res) {
  const ALLOWED = "https://bd71.vercel.app";

  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  if (!origin.startsWith(ALLOWED) || !referer.startsWith(ALLOWED)) {
    return res.status(403).json({ error: "Forbidden: Invalid Origin or Referer" });
  }

  const target =
    "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

  try {
    const response = await fetch(target);
    let m3u8 = await response.text();

    // Rewrite .ts links to proxy
    m3u8 = m3u8.replace(
      /(.*\.ts)/g,
      (match) =>
        `${ALLOWED}/api/segment?u=${encodeURIComponent(match)}`
    );

    res.setHeader("Access-Control-Allow-Origin", ALLOWED);
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(m3u8);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch master m3u8" });
  }
}
