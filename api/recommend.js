export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { message } = req.body;

    // Prompt برای Gemini که خروجی دقیقاً JSON بده
    const systemPrompt = `
You are an AI course recommender specializing in astronomy.

Return ONLY a valid JSON object EXACTLY in the following format:

{
  "main_course": "string - Persian",
  "level": "string - beginner / intermediate / advanced in Persian",
  "reason": "string - Persian",
  "secondary_course": "string or null"
}

Rules:
- Response must be valid JSON only (no text before or after).
- All text values must be in Persian.
- "secondary_course" can be null.
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
                { text: message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const raw =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsedJSON;

    try {
      parsedJSON = JSON.parse(raw);
    } catch ) {
      parsedJSON = {
        main_course: "پاسخ نامعتبر از مدل",
        level: "نامشخص",
        reason: "خروجی به صورت JSON معتبر نبود.",
        secondary_course: null,
        raw_response: raw
      };
    }

    return res.status(200).json(parsedJSON);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
