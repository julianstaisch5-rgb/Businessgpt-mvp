import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitQuestion(e) {
    e.preventDefault();
    setError("");
    setAnswer("");
    if (!question.trim()) {
      setError("Bitte eine Frage eingeben.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Serverfehler");
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setError(err.message || "Fehler beim Abruf");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>BusinessGPT – dein KI-Business-Berater (MVP)</h1>
      <p>Gib hier die Frage eines Unternehmers ein. Die Antwort wird von der KI generiert.</p>

      <form onSubmit={submitQuestion}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Zum Beispiel: Wie skaliere ich Marketing für ein SaaS mit 5.000€/Monat Umsatz?"
          rows={5}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />
        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loading} style={{ padding: "10px 16px", fontSize: 16 }}>
            {loading ? "Antwort wird generiert…" : "Frage abschicken"}
          </button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {answer && (
        <section style={{ marginTop: 20 }}>
          <h3>Antwort</h3>
          <div style={{ whiteSpace: "pre-wrap", background: "#f8f8f8", padding: 15, borderRadius: 6 }}>
            {answer}
          </div>
        </section>
      )}

      <footer style={{ marginTop: 40, color: "#666", fontSize: 14 }}>
        <p>Hinweis: Diese Seite ist ein MVP. API-Schlüssel sind sicher auf dem Server gespeichert.</p>
      </footer>
    </main>
  );
}
