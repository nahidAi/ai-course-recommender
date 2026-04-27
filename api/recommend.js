module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: query }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    let text = null;

    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      text = data.candidates[0].content.parts
        .map((p) => p.text || "")
        .join(" ");
    }

    return res.status(200).json({
      recommendation: text || "No recommendation generated."
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      error: "Server crashed",
      details: error.message
    });
  }
};
