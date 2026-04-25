export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
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

    const result = await response.json();

    // استخراج متن خروجی مدل
    const rawText =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // تبدیل متن JSON به آبجکت
    const parsed = JSON.parse(rawText);

    // فقط همون آبجکت تمیز رو برگردون
    return Response.json(parsed);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: "SERVER_FAILED" }, { status: 500 });
  }
}
