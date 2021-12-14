import test from "ava";
import { ConsoleLog, Miniflare } from "miniflare";
import crypto from "crypto";

test.beforeEach(t => {
  const mf = new Miniflare({
    buildCommand: undefined,
    scriptPath: "./dist/worker.mjs"
  });
  t.context = { mf };
});

test("test file does not exist", async t => {
  const { mf } = t.context;
  const res = await mf.dispatchFetch("http://localhost:8787/raytheon.md");
  t.is(res.status, 404);
});

test("test file exists, and has correct content-type", async t => {
  const controlHash = "3916912af7641c94b25f38e1d60559c49065d822";
  const { mf } = t.context;
  const res = await mf.dispatchFetch("http://localhost:8787/pusheen.jpeg");
  const hash = await streamHash(res);
  t.is(hash, controlHash);
  t.is("image/jpeg", res.headers.get("content-type"));
});


async function streamHash(res) {
  const shasum = crypto.createHash("sha1"),
   stream = res.body.getReader();
  while(true) {
    const {done, value} = await stream.read();
    if(done) return shasum.digest("hex");
    shasum.update(value);
  }
}