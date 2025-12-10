export default async function handler(req, res) {
  const target =
    "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

  try {
    const response = await fetch(target);
    let text = await response.text();

    const base = target.replace("master.m3u8", "");

    const output = text.split("\n").map(line => {
      line = line.trim();
      if (!line || line.startsWith("#")) return line;

      const abs = new URL(line, base).href;

      if (abs.endsWith(".m3u8")) {
        return `/api/master?u=${encodeURIComponent(abs)}`;
      }

      if (abs.endsWith(".ts")) {
        return `/api/segment?u=${encodeURIComponent(abs)}`;
      }

      return line;
    }).join("\n");

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(output);
  } catch (err) {
    res.status(500).send("Failed to load master playlist");
  }
}
