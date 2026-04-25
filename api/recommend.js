export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini"
,
        input: [
          {
            role: "user",
            content: `You are an AI course recommender. User message: ${message}. 
Return JSON like this:
{
 "recommendation": "...",
 "level": "...",
 "reason": "...",
 "complementary": "..."
}`
          }
        ]
      }),
    });

    const data = await response.json();

    // استخراج امن
    const output =
      data?.output?.[0]?.content?.[0]?.json ??
      { error: "Model returned no structured JSON." };

    return res.status(200).json(output);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Server failed to process request." });
  }
}
