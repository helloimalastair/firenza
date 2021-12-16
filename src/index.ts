import b2RequestHandler from "./B2Utils";
import { homePage } from "./html";
export default {
  async fetch(req: Request, env: EnvironmentBindings, ctx: ExecutionContext) {
    const cache = await caches.open("b2OnWorkers"),
      url = new URL(req.url);
    if(url.pathname === "/") return homePage();
    // If result is cached, serve it immediately.
    let res = await cache.match(req.url);
    if(res) return res;
    // Since result is not cached, attempt to retrieve from B2, and return.
    return await b2RequestHandler(url.pathname, env, ctx, req.url, cache);
  }
}