export default async function handler(req, res) {
  // ۱. تنظیم هدرهای CORS برای امنیت و دسترسی
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { question, level } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // ۲. استفاده از دقیق‌ترین مدل طبق تستی که انجام دادی
    const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${API_KEY}`;

    // ۳. پرامپت مهندسی شده برای ناهید (تجربه یادگیری تطبیقی)
    const prompt = `
      You are an expert Astronomy educator. 
      The user is at a "${level}" level.
      User Question: "${question}"
      
      Please provide a structured learning path in 4 steps:
      1. Simple Explanation (tailored to ${level} level)
      2. Key Concepts to master
      3. A "Mind-Blowing" fact about this topic
      4. Recommended next question to explore.
      
      Format the response using clean Markdown.
    `;

    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // لاگ برای دیباگ در پنل Vercel
    console.log("GEMINI SUCCESSFUL RESPONSE:", JSON.stringify(data));

    if (data.candidates && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      res.status(200).json({ recommendation: text });
    } else {
      res.status(500).json({ 
        error: "Model returned empty", 
        raw: data 
      });
    }

  } catch (error) {
    console.error("BACKEND ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
