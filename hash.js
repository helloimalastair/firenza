const fs = require("fs"),
  crypto = require("crypto"),
  fd = fs.createReadStream("tests/files/pusheen.jpeg"),
  fweb = fs.createReadStream("pusheen.jpeg"),
  hash = crypto.createHash("sha1"),
  hashWeb = crypto.createHash("sha1");
  hash.setEncoding("hex");
  hashWeb.setEncoding("hex");
  
fd.on("end", () => {
  hash.end();
  console.log(`Stored version: ${hash.read()}`); // the desired sha1sum
});

fweb.on("end", () => {
  hashWeb.end();
  console.log(`Web version: ${hashWeb.read()}`); // the desired sha1sum
});
  
// read all file and pipe it (write it) to the hash object
fd.pipe(hash);
fweb.pipe(hashWeb);