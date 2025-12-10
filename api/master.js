export default async function handler(req, res) {
  try {
    const url = req.query.u
      ? decodeURIComponent(req.query.u)
      : "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

    const response = await fetch(url);
    if (!response.ok) return res.status(502).send("Upstream Error");

    let text = await response.text();

    const base = url.replace(/[^/]+$/, "");

    const lines = text.split("\n").map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;

      const abs = new URL(trimmed, base).href;

      if (abs.endsWith(".m3u8")) {
        return `/api/master?u=${encodeURIComponent(abs)}`;
      }
      if (abs.endsWith(".ts")) {
        return `/api/segment?u=${encodeURIComponent(abs)}`;
      }

      return line;
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    return res.send(lines.join("\n"));

  } catch (err) {
    return res.status(500).send("Playlist Error");
  }
}
