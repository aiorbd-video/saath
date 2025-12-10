export default async function handler(req, res) {
  const target =
    "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

  try {
    const response = await fetch(target);
    let m3u8 = await response.text();

    m3u8 = m3u8.replace(
      /(.*\.ts)/g,
      match => `/api/segment?u=${encodeURIComponent(match)}`
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

    return res.status(200).send(m3u8);
  } catch (e) {
    return res.status(500).json({ error: "stream error" });
  }
}
