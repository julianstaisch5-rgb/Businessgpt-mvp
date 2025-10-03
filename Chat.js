export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "No question provided" });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const systemPrompt = `Du bist BusinessGPT, ein deutscher, präziser und umsetzungsorientierter KI-Berater für Unternehmer. 
Antworten auf Deutsch. Jede Antwort soll enthalten:
1) Kurze Zusammenfassung (1-2 Sätze)
2) 3 konkrete, priorisierte Schritte
3) Nötige Tools/Ressourcen (Stichworte)
4) Mögliche Risiken/Was zu prüfen ist
Antworte klar, nummeriert und in Aktionssprache.`;

    const payload = {
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 700,
      temperature: 0.2
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: data.error?.message || "OpenAI API Fehler" });
    }

    const text = data.choices?.[0]?.message?.content || JSON.stringify(data);
    res.status(200).json({ answer: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverfehler" });
  }
}
