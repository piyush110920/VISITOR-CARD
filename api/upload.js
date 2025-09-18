export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Read the raw body data from the request
    const body = await new Response(req.body).arrayBuffer();

    // Create a new Headers object to avoid modifying the original
    const headers = new Headers(req.headers);

    // Remove headers that might cause issues with the proxy
    headers.delete('host');
    headers.delete('content-length');

    const response = await fetch(
      "http://ai.senselive.io:5678/webhook-test/senselive-visitor-card",
      {
        method: req.method,
        headers: headers, // Use the modified headers
        body: body, // Pass the raw body data
      }
    );

    const contentType = response.headers.get("content-type");
    const responseData = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.status(response.status).send(Buffer.from(responseData));
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
}