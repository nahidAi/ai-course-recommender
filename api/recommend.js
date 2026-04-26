import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are a course recommendation model.
    Return ONLY valid JSON:
    {
      "main_course": "string",
      "level": "Beginner | Intermediate | Advanced",
      "reason": "string",
      "secondary_course": "string"
    }
    User request:
    ${message}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try to parse JSON
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("Gemini did not return valid JSON\n", text);
      return Response.json({ error: "Invalid JSON from model", raw: text }, { status: 500 });
    }

    return Response.json(json);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
