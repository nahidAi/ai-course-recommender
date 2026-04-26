export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    // فراخوانی Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: query
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // اگر ارور از سمت Gemini برگشته بود، به کلاینت پاسش بده
    if (!response.ok) {
      console.error("GEMINI ERROR:", data);
      return res.status(response.status).json({ error: data });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
