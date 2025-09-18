export const config = {
  api: {
    bodyParser: false, // Important for images and raw streams
  },
};

export default async function handler(req, res) {
  try {
    // Read the raw body stream from the incoming request
    const body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    const response = await fetch(
      "http://ai.senselive.io:5678/webhook-test/senselive-visitor-card",
      {
        method: req.method,
        headers: {
          ...req.headers,
          // IMPORTANT: The `host` and `content-length` headers need to be removed.
          // `fetch` will set them automatically and incorrectly forwarding them causes issues.
          host: undefined, 
          'content-length': undefined,
        },
        // Pass the raw body data directly
        body: req.method === "POST" ? body : undefined, 
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