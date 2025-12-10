export default async function handler(req, res) {
  try {
    const url = decodeURIComponent(req.query.u);
    if (!url) return res.status(400).send("Missing segment URL");

    const r = await fetch(url);
    if (!r.ok) return res.status(502).send("Segment Fetch Error");

    const buffer = Buffer.from(await r.arrayBuffer());

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");
    return res.send(buffer);

  } catch (e) {
    return res.status(500).send("Segment Proxy Error");
  }
}
