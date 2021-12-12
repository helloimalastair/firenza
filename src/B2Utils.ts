import { internalError, fileNotFound } from "./html";
export default async function b2RequestHandler(file: string, env: EnvironmentBindings, ctx: ExecutionContext, fullURL: string) : Promise<Response> {
  const token = await tokenGet(env, ctx),
  // fetch resource using token
    res = await fetch(`https://${env.B2URL}/${env.BUCKET_NAME}/${file}`, {headers: {authorization: token}});
  // handle any errors that may have occurred with fetching the resource from B2
  switch(res.statusText) {
    case "expired_auth_token":
      return internalError("Unexpectedly expired token.", fullURL);
    case "download_cap_exceeded":
      return internalError("Download Cap has been exceeded.", fullURL);
    case "not_found":
      return fileNotFound(fullURL);
  }
  return res;
}

async function tokenGet(env: EnvironmentBindings, ctx: ExecutionContext) {
  let token : string = await env.KV.get("b2APIToken");
  if(token) return token;
  token = ((await (await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {headers: {authorization:env.B2APIKEY}})).json()) as b2AuthResponse).authorizationToken;
  ctx.waitUntil(env.KV.put("b2APIToken", token, {expirationTtl: 85800}));
  return token;
}