export async function POST(req) {
  try {
    const { message } = await req.json();

    const MODEL = "models/gemini-2.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Respond ONLY with valid JSON object. No explanation.\n\nUser message:\n" +
                    message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return Response.json(
        { error: "MODEL_EMPTY_RESPONSE", data },
        { status: 500 }
      );
    }

    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return Response.json(
        { error: "NO_JSON_FOUND", raw: text },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      return Response.json(
        { error: "JSON_PARSE_FAILED", raw: text },
        { status: 500 }
      );
    }

    return Response.json(parsed, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "SERVER_CRASH", message: err.message },
      { status: 500 }
    );
  }
}
