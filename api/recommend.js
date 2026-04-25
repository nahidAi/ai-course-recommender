export async function POST(req) {
  try {
    const { goal } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `هدف کاربر: ${goal}\n یک پیشنهاد دوره مناسب بده.` }]
            }
          ]
        })
      }
    );

    const result = await response.json();
    return Response.json(result);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: "SERVER_FAILED" }, { status: 500 });
  }
}
