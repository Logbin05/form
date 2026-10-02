const API_URL = "https://form-api.demo1fort.workers.dev";

async function submitForm(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ошибка отправки");
}
