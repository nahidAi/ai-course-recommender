export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiRes = await fetch(
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

    const result = await apiRes.json();

    // استخراج متن خام از Gemini
    const rawText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // اگر خالی بود، همون رو برگردون برای دیباگ
    if (!rawText) {
      return Response.json({ error: "NO_TEXT", result }, { status: 500 });
    }

    // تلاش کن متن رو به JSON تبدیل کنی
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      // اگر مدل هنوز توضیح اضافه آورد، همون متن خام رو برگردون
      return Response.json({ error: "PARSE_FAILED", rawText }, { status: 500 });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json(
      { error: "SERVER_FAILED", detail: String(err) },
      { status: 500 }
    );
  }
}
