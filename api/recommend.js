export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { message } = req.body;

    const systemPrompt = `
You are an AI course recommender for astronomy courses.

Return STRICTLY a valid JSON object in this exact format, with keys in English:

{
  "main": {
    "title": "string - main recommended course title",
    "level": "string - beginner / intermediate / advanced (in Persian)",
    "reason": "string - short explanation in Persian"
  },
  "alternatives": [
    {
      "title": "string",
      "level": "string",
      "reason": "string"
    }
  ]
}

Rules:
- Answer in Persian for all text fields (title, level, reason).
- Do NOT include any extra text before or after the JSON.
- Do NOT use Markdown.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User goal: ${message}` },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let jsonResult;

    try {
      jsonResult = JSON.parse(rawText);
    } catch (e) {
      // اگر JSON نباشد، یک ساختار پیش‌فرض می‌سازیم
      jsonResult = {
        main: {
          title: "پیشنهاد دوره در دسترس نیست",
          level: "نامشخص",
          reason: "پاسخ مدل در قالب JSON معتبر نبود.",
        },
        alternatives: [],
        rawText,
      };
    }

    res.status(200).json(jsonResult);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
