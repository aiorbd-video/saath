export default async function handler(req, res) {
  const target =
    "https://cloudfrontnet.vercel.app/tplay/playout/209611/master.m3u8";

  try {
    const r = await fetch(target);
    let m3u8 = await r.text();

    // absolute segment URL create
    const base = target.replace("master.m3u8", "");

    // rewrite TS segments to proxy route
    m3u8 = m3u8.replace(
      /(.*\.ts)/g,
      seg => `/api/segment?u=${encodeURIComponent(base + seg)}`
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

    res.status(200).send(m3u8);
  } catch (e) {
    res.status(500).send("m3u8 error");
  }
}
