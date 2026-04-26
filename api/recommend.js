export async function POST(req) {
  try {
    const { message } = await req.json();

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Please answer ONLY using a clean JSON. No explanations. User message: " +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return Response.json(
        { error: "MODEL_EMPTY_RESPONSE", data },
        { status: 500 }
      );
    }

    // Try to extract JSON from the text
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return Response.json(
        { error: "NO_JSON_FOUND", raw: text },
        { status: 500 }
      );
    }

    // Parse only extracted JSON
    const parsed = JSON.parse(match[0]);

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
