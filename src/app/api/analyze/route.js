export async function POST(req) {
  try {
    const { text } = await req.json();
    const timestamp = Date.now();
    
    // System Prompt kita bikin lebih tegas
    const systemPrompt = "You are an API that ONLY returns valid JSON. No other text.";

    // 🔥 JURUS RAHASIA: Kita gabung curhatan user dengan paksaan format JSON di pesan utama
    const combinedText = `
User message: "${text}"

Based on the user message above, analyze it and reply ONLY with a valid JSON object. DO NOT include greetings, empathy, markdown like \`\`\`json, or any extra text.

Return exactly this structure:
{
  "score": <number between 10-100 evaluating their life situation>,
  "insight": "<your sharp, objective analysis in Indonesian>",
  "reality": "<a harsh but true reality check in Indonesian>",
  "recommendation": "<one practical next step in Indonesian>"
}
`;

    // Kita pakai parameter sesuai dokumentasi
    const params = new URLSearchParams({
      text: combinedText, // Masukin gabungan teks ke sini
      promptsystem: systemPrompt,
      cookie: "gemini_session_bypass" 
    });

    const url = `https://api.siputzx.my.id/api/ai/gemini?${params.toString()}`;
    console.log("🚀 [MENEMBAK API GEMINI LAGI]:", url);

    const res = await fetch(url, { cache: "no-store" });
    const rawText = await res.text(); 
    const data = JSON.parse(rawText);

    if (!data.status) {
      console.error("🚨 [API MENOLAK]:", rawText);
      throw new Error("API Siputzx menolak request");
    }

    let aiText = typeof data.data === 'string' ? data.data : data.data?.response || data.data?.message || "";
    console.log("🤖 [TEKS MENTAH DARI GEMINI]:", aiText);

    // Bersihkan dari markdown dan sisa-sisa
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Ambil yang di dalam kurung kurawal aja
    const match = aiText.match(/\{[\s\S]*\}/);
    
    let parsed;
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e) {
        console.error("Gagal parse regex JSON:", e);
      }
    }

    // Fallback kalau dia masih bandel ngasih teks doang
    if (!parsed) {
      console.log("⚠️ [GEMINI TETAP BANDEL KASIH TEKS BEBAS]");
      parsed = {
        score: Math.floor(Math.random() * (75 - 50 + 1)) + 50,
        insight: aiText.length > 5 ? aiText.substring(0, 150) + "..." : "Gemini gagal membuat analisa yang proper.",
        reality: "AI masih sulit memproses ini ke format yang web kita butuhkan.",
        recommendation: "Coba dengan kalimat yang lebih jelas."
      };
    }

    console.log("✅ [BERHASIL]:", parsed);
    return Response.json(parsed);

  } catch (error) {
    console.error("❌ [ERROR FATAL]:", error);
    return Response.json({
      score: 60, 
      insight: "Jaringan ke otak Gemini terputus.",
      reality: "Terkadang hal teknis di luar kendali kita.",
      recommendation: "Coba tarik napas dan klik analyze lagi."
    });
  }
}