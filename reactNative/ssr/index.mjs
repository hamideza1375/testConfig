import express from "express"
import fs from "fs"
import path from "path"
import router from "./router.mjs"
const app = express();
app.use(router)
app.use(express.static(path.resolve('./', "build")));
app.listen(3001, () => { console.log("App is launched to port 3001") });
app.use((req, res) => {res.send(fs.readFileSync(path.resolve("./build/index.html"), "utf-8"));});