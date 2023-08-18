import express from 'express';
const router = express()
import fs from "fs"
import path from "path"

router.get('/:key', (req, res, next) => {
  if (req.params.key == 'home' || req.url == '/') {
    fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
      return res.send(data.replace('<div dir="rtl" id="root"></div>', `<div dir="rtl" id="root">${fs.readFileSync(path.resolve("./ssr/home.html"), "utf-8")}</div>`));
    })
  } else next()
});


router.get('/products/:id', (req, res) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    var d = data.replace('<title>دیجی کالا</title>', `<title>محصولات</title>`)
    d = d.replace('<div dir="rtl" id="root"></div>', `<div dir="rtl" id="root">${fs.readFileSync(path.resolve("./ssr/singleproduct.html"), "utf-8")}</div>`)
    res.send(d);
  });
});


router.get('/singleproduct/:id', (req, res) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    var d = data.replace('<title>دیجی کالا</title>', `<title>${req.query.title}</title>`)
    d = d.replace('<div dir="rtl" id="root"></div>', `<div dir="rtl" id="root">${fs.readFileSync(path.resolve("./ssr/singleproduct.html"), "utf-8")}</div>`)
    res.send(d);
  });
});

export default router