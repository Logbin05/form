const URL =
  "https://script.google.com/macros/s/AKfycbzIvxfN_VGeeZocgR_vmF33MlFtMv6ZBuLPRGgfXkiBheV4Ud8NDxlrXxLs-Ii3k6c2DQ/exec";
async function submitForm(data) {
  await fetch(URL, {
    method: "POST",
    mode: "no-cors", //
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  });
}
