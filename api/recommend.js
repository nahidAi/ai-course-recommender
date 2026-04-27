module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
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

    // --- Safe extraction helper ---
    const extractText = (resp) => {
      try {
        if (
          resp.candidates &&
          resp.candidates[0] &&
          resp.candidates[0].content &&
          resp.candidates[0].content.parts
        ) {
          const parts = resp.candidates[0].content.parts;

          // 1) direct .text
          if (parts[0].text) return parts[0].text;

          // 2) join all text parts
          const all = parts
            .map(p => p.text)
            .filter(Boolean)
            .join(" ");

          if (all) return all;
        }
      } catch (e) {
        console.log("Extraction error:", e);
      }
      return null;
    };

    const text = extractText(data) || "No recommendation generated.";

    return res.status(200).json({
      recommendation: text
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server crashed",
      details: error.message
    });
  }
};
