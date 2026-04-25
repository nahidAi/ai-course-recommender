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
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",

        // 🔥 ساختار صحیح طبق آخرین نسخه API
        response_format: { type: "json_object" },

        input: message
      })
    });

    const completion = await response.json();

    if (completion.error) {
      return res.status(400).json({ error: completion.error.message });
    }

    // مسیر صحیح خروجی مدل
    const text = completion.output?.[0]?.content?.[0]?.text;

    if (!text) {
      return res.status(400).json({ error: "Model returned no structured JSON." });
    }

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
