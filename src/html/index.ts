import InternalError from "./InternalError.html";
import FileNotFound from "./FileNotFound.html";
import HomePage from "./HomePage.html";
export async function internalError(err: string, url: string) : Promise<Response> {
  const ray = Math.round(Math.random() * Date.now()).toString(16);
  console.error(`Error Occurred: "${ray}", at ${new Date()}. Ray ID: ${ray}.`);
  return new Response(InternalError.replace("RAY_ID", ray).replace("CANON_URL", url), {status: 500, statusText: "Internal Error"});
};
export function fileNotFound(url: string) : Response {
  return new Response(FileNotFound.replace("CANON_URL", url), {status: 404, statusText: "Not Found"});
};
export function homePage() : Response {
  return new Response(HomePage, {status: 200, statusText: "OK"});
};