const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_KEY",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: "Hello Gemini" }]
        }
      ]
    })
  }
);

const data = await response.json();
console.log(data);
