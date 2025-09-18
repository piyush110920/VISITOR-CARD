import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Needed to handle raw file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read the incoming request as a buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Build FormData to forward to n8n webhook
    const form = new FormData();
    if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
      form.append("image", buffer, {
        filename: req.headers["x-file-name"] || "upload.jpg",
        contentType: req.headers["content-type"],
      });
    }

    // Append other fields if sent as FormData
    // Here we assume sheetId, gid, requirements, action
    if (req.headers["x-fields"]) {
      const fields = JSON.parse(req.headers["x-fields"]);
      Object.keys(fields).forEach((key) => {
        form.append(key, fields[key]);
      });
    }

    // Forward request to n8n webhook
    const response = await fetch(
      "http://ai.senselive.io:5678/webhook-test/senselive-visitor-card",
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    // Forward response back to frontend
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
