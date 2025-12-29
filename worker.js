export default {
  async fetch(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return new Response("Missing url", { status: 400 });
    }

    const headers = {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://moviesdoofree.com/",
      "Origin": "https://moviesdoofree.com"
    };

    const res = await fetch(target, { headers });
    let body = await res.text();

    /* rewrite m3u8 ให้ ts วิ่งผ่าน proxy */
    if (target.includes(".m3u8")) {
      body = body.replace(
        /(https?:\/\/[^\s"'#]+)/g,
        match => url.origin + "/?url=" + encodeURIComponent(match)
      );
    }

    return new Response(body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream"
      }
    });
  }
};
