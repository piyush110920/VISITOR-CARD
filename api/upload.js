import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append("file", buffer, {
      filename: req.headers["x-file-name"] || "upload.jpg", // fallback filename
      contentType: req.headers["content-type"],
    });

    const response = await fetch(
      "http://ai.senselive.io:5678/webhook-test/senselive-visitor-card",
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
