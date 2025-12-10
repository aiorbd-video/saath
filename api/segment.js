export default async function handler(req, res) {
  const url = req.query.u;
  if (!url) return res.status(400).send("Missing ts URL");

  try {
    const stream = await fetch(url);
    const buffer = await stream.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Segment load failed");
  }
}
