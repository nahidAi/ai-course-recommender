export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const result = await apiRes.json();

    const rawText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const parsed = JSON.parse(rawText);

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
