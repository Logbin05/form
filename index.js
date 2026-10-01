const URL =
  "https://script.google.com/macros/s/AKfycbzApJS9k5GNDFU7fMQY0o9d498ZFBElU0RsYm7knmEJBANMwja41Zzh_yE6wwF4haYjBQ/exec";
async function submitForm(data) {
  await fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  });
}
