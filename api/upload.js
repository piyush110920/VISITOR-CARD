import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "http://ai.senselive.io:5678/webhook-test/senselive-visitor-card",
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: "", // avoid conflicts
        },
        body: req, // pass the incoming stream directly
      }
    );

    res.status(response.status);
    response.body.pipe(res); // pipe response back to client
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
