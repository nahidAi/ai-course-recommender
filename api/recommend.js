console.log("### API FILE LOADED SUCCESSFULLY ###");
export const config = {
  api: {
    bodyParser: true,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { question, level } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const model = "models/gemini-2.5-flash";

    const prompt = `
User level: ${level}
Question:
${question}

Give a clear explanation and the next learning recommendation.
`;

    const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    const resultText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join(" ")
        .trim() || null;

    return res.status(200).json({
      recommendation: resultText || "No recommendation generated.",
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
};
