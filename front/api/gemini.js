export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const { location, vibe, budget, time } = req.body || {};
    if (!location) return res.status(400).json({ error: "Missing location" });

    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const prompt = `
너는 한국 데이트 코스 플래너야.
장소: ${location}
분위기(선택): ${vibe || "상관없음"}
예산(선택): ${budget || "상관없음"}
시간대/소요시간(선택): ${time || "상관없음"}

요구사항:
- 데이트 코스 3개 제안
- 각 코스는 2~3개 활동으로 구성 (이동 동선 자연스럽게)
- 각 활동은: "장소/활동명 - 한줄 설명 - 예상비용(대략)" 형식
- 마지막에 '비 오는 날 대체 코스 1개'도 추가
- 한국어로 간결하게
    `.trim();

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("\n") || "";

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}