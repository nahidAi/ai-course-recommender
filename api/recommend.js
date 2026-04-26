export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }]
        })
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    let answer = null;

    // مسیر استاندارد
    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      for (const p of parts) {
        if (p.text) {
          answer = p.text;
          break;
        }
      }
    }

    // مسیر inlineData
    if (!answer && Array.isArray(parts)) {
      for (const p of parts) {
        if (p.inlineData?.data) {
          answer = p.inlineData.data;
          break;
        }
      }
    }

    // مسیر functionCall
    if (!answer && Array.isArray(parts)) {
      for (const p of parts) {
        if (p.functionCall) {
          answer = JSON.stringify(p.functionCall);
          break;
        }
      }
    }

    // مسیر fallback نهایی
    if (!answer) {
      answer = "No readable text found, see raw response in logs.";
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
}
