export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { query } = req.body;

  // Fake AI response for testing
  const fakeAnswer = `You asked: "${query}". This is a test response from your API!`;

  res.status(200).json({
    answer: fakeAnswer
  });
}
