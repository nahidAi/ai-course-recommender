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

        // 🔑 طبق متن خطا: پارامتر رفته زیر text
        text: {
          // مقادیر معتبر بسته به نسخه می‌تونه مثلاً:
          // "plain" | "markdown" | "json" باشه.
          // اینجا می‌خوایم JSON بگیریم:
          format: "json",
        },
      }),
    });

    const completion = await response.json();

    if (!response.ok) {
      // اگر خود API ارور داد، همون متن رو پاس بده به فرانت
      return res.status(response.status).json({
        error:
          completion?.error?.message ||
          `OpenAI error with status ${response.status}`,
      });
    }

    // در Responses API ساختار خروجی معمولاً این‌طوره:
    // completion.output[0].content[0].text
    const aiText = completion.output?.[0]?.content?.[0]?.text;

    if (!aiText) {
      return res
        .status(400)
        .json({ error: "Model returned no structured JSON." });
    }

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      // اگر مدل JSON درست برنگردوند
      return res.status(400).json({
        error: "Model response was not valid JSON.",
        raw: aiText,
      });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
