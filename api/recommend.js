export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { query } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // سبک، سریع و ارزان
        messages: [
          { role: "user", content: query }
        ]
      })
    });

    const data = await response.json();

    const answer = data?.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ answer });

  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err });
  }
}
