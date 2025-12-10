export default async function handler(req, res) {
  const url = req.query.u;
  if (!url) return res.status(400).json({ error: "missing segment url" });

  try {
    const segment = await fetch(url);
    const buffer = await segment.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");

    return res.send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({ error: "segment error" });
  }
}
