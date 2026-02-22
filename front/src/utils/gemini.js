const askGeminiByLocation = async (location) => {
  const r = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || JSON.stringify(data));
  return data.text;
};

const onClickPlace = async (place) => {
  const text = await askGeminiByLocation(place);
  setAnswer(text); 
};