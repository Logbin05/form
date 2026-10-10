const reply = (body, status, cors) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };

    try {
      if (request.method === "OPTIONS")
        return new Response(null, { headers: cors });
      if (request.method !== "POST" || origin !== env.ALLOWED_ORIGIN) {
        return reply({ error: "forbidden" }, 403, cors);
      }

      if (!env.SCRIPT_URL) {
        console.error("SCRIPT_URL не задан");
        return reply({ error: "secret_missing" }, 500, cors);
      }

      const text = await request.text();
      if (text.length > 4000) return reply({ error: "too_large" }, 413, cors);

      let d;
      try {
        d = JSON.parse(text);
      } catch {
        return reply({ error: "bad_json" }, 400, cors);
      }
      if (d.website) return reply({ ok: true }, 200, cors);
      if (!d.fio || !d.contact || !d.clubs?.length)
        return reply({ error: "bad_request" }, 400, cors);

      let res;
      try {
        res = await fetch(env.SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: text,
          redirect: "follow",
        });
      } catch (e) {
        console.error("Apps Script недоступен:", e);
        return reply({ error: "upstream_unreachable" }, 502, cors);
      }


      const body = await res.text();
      let parsed = null;
      try {
        parsed = JSON.parse(body);
      } catch {}
      if (!res.ok || parsed?.ok !== true) {
        console.error(
          "Запись в таблицу не подтверждена:",
          res.status,
          body.slice(0, 300),
        );
        return reply({ error: "sheet_write_failed" }, 502, cors);
      }

      return reply({ ok: true }, 200, cors);
    } catch (e) {
      console.error(e);
      return reply({ error: "internal" }, 500, cors);
    }
  },
};
