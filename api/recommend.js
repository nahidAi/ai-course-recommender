import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    console.log("GEMINI KEY:", process.env.GEMINI_API_KEY); // debug

    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // IMPORTANT: use a valid model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

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

    return Response.json(JSON.parse(text));

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
