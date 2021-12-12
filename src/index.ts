import b2RequestHandler from "./B2Utils";
export default {
  async fetch(req: Request, env: EnvironmentBindings, ctx: ExecutionContext) {
    const cache = await caches.open("b2OnWorkers"),
      url = new URL(req.url);
    // If result is cached, serve it immediately.
    let res = await cache.match(url.pathname);
    if(res) return res;
    // Since result is not cached, attempt to retrieve from B2.
    res = await b2RequestHandler(url.pathname, env, ctx, req.url);
    // Cache result
    let bodies = res.body.tee();
    const cacheRes = new Response(bodies[0]);
    cacheRes.headers.set("Cloudflare-CDN-Cache-Control", `max-age=${env.MAX_AGE}`);
    ctx.waitUntil(cache.put(url.pathname, cacheRes));
    // Return response
    return new Response(bodies[1]);
  }
}