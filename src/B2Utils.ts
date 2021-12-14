import { internalError, fileNotFound } from "./html";
import mime from "mime/lite";
export default async function b2RequestHandler(file: string, env: EnvironmentBindings, ctx: ExecutionContext, fullURL: string) : Promise<Response> {
  const token = await tokenGet(env, ctx),
  // fetch resource using token
    res = await fetch(`https://${env.B2URL}/file/${env.BUCKET_NAME}${file}`, {headers: {authorization: token}});
  console.log(`URL: ${`https://${env.B2URL}/file/${env.BUCKET_NAME}${file}`}, Status: ${res.status}, text: ${res.statusText}`);
  // handle any errors that may have occurred with fetching the resource from B2
  switch(res.statusText) {
    case "Expired Auth Token":
      return internalError("Unexpectedly expired token.", fullURL);
    case "Download Cap Exceeded":
      return internalError("Download Cap has been exceeded.", fullURL);
    case "Bad Request":
      return internalError("Bad Request", fullURL);
    case "Not Found":
      return fileNotFound(fullURL);
  }
  res.headers.set("content-type", mime.getType(file.split(".")[file.split(".").length - 1]) || "text/plain");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}

async function tokenGet(env: EnvironmentBindings, ctx: ExecutionContext) {
  let token : string = await env.KV.get("b2APIToken");
  if(token) return token;
  token = ((await (await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {headers: {authorization:env.B2APIKEY}})).json()) as b2AuthResponse).authorizationToken;
  ctx.waitUntil(env.KV.put("b2APIToken", token, {expirationTtl: 85800}));
  return token;
}