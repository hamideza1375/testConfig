import express from 'express';
const router = express()
import fs from "fs"
import path from "path"
import cheerio from "cheerio"

// router.get('/', (req, res) => {res.redirect('/home')});

router.get('/:key', (req, res, next) => {
  if (req.params.key === 'home' || req.url == '/' ) {
    const $ = cheerio.load(fs.readFileSync(path.resolve("./build/index.html"), "utf-8"))
    $('#root').html(fs.readFileSync(path.resolve("./ssr/home.html"), "utf-8"))
    res.send($.html())
  } else next()
});

router.get('/singleproduct/:id', (req, res) => {
  const $ = cheerio.load(fs.readFileSync(path.resolve("./build/index.html"), "utf-8"))
  $('meta[name="description"]').attr('content', req.query.title + 'موبایل تبلت هدفون')
  $('title').text(req.query.title)
  $('h1').text(req.query.title)
  $('#root').html(fs.readFileSync(path.resolve("./ssr/singleproduct.html"), "utf-8"))
  res.send($.html())
});

export default router