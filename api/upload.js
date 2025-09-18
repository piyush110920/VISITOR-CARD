export const config = {
  api: {
    bodyParser: false, // Important for images
  },
};

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "http://ai.senselive.io:5678/webhook/senselive-visitor-card",
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: "", // remove host to avoid conflicts
        },
        body: req.method === "POST" ? req.body : undefined,
      }
    );

    const contentType = response.headers.get("content-type");
    const data = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.status(response.status).send(Buffer.from(data));
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
