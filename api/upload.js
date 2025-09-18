import { FormData } from "formdata-node";
import { File } from "fetch-blob";
import fetch from "node-fetch"; // Node.js fetch

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Read file + other fields
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Extract extra fields from headers
    const extraFields = req.headers["x-fields"] ? JSON.parse(req.headers["x-fields"]) : {};

    const form = new FormData();
    // Append the image as a File object
    form.set("image", new File([buffer], req.headers["x-file-name"] || "upload.jpg", { type: req.headers["content-type"] }));
    
    // Append other fields
    Object.keys(extraFields).forEach(key => form.set(key, extraFields[key]));

    // Send to n8n webhook
    const response = await fetch("http://ai.senselive.io:5678/webhook-test/senselive-visitor-card", {
      method: "POST",
      body: form,
      headers: form.headers, // set headers for multipart/form-data
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
}
