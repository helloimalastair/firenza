const fs = require("fs"),
  htmlMinifier = require("html-minifier"),
  miniHTML = html => fs.writeFileSync("./src/html/"+html, htmlMinifier.minify(fs.readFileSync("./html/"+html).toString(),{collapseBooleanAttributes:!0,collapseInlineTagWhitespace:0,collapseWhitespace:!0,decodeEntities:!0,html5:!0,quoteCharacter:'"',removeAttributeQuotes:!0,removeComments:!0,removeEmptyAttributes:!0,removeRedundantAttributes:!0,removeStyleLinkTypeAttributes:!0,sortAttributes:!0,sortClassName:!0,useShortDoctype:!0}));
miniHTML("FileNotFound.html");
miniHTML("InternalError.html");
miniHTML("HomePage.html");