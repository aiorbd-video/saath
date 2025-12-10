export default async function handler(req, res) {
  const url = req.query.u;
  if (!url) return res.status(400).json({ error: "Missing segment URL" });

  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");

    return res.send(Buffer.from(data));
  } catch (err) {
    return res.status(500).json({ error: "Failed to load segment" });
  }
}
