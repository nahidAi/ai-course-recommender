// api/recommend.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: message,

        // ✅ ساختار درست طبق ارور
        text: {
          format: {
            type: "json"
          }
        }
      }),
    });

    const completion = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        err completion?.error?.message || "OpenAI error"
      });
    }

    const aiText = completion.output?.[0]?.content?.[0]?.text;

    if (!aiText) {
      return res.status(400).json({
        error: "Model returned no structured JSON."
      });
    }

    const parsed = JSON.parse(aiText);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status
