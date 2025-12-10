export default async function handler(req, res) {
  const url = req.query.u;

  if (!url) return res.status(400).json({ error: "missing ts url" });

  try {
    const r = await fetch(url);
    const buf = await r.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");

    res.send(Buffer.from(buf));
  } catch (e) {
    res.status(500).json({ error: "segment error" });
  }
}
