import app from "./src/app.js";
import DataHandler from "./src/db/DataHandler.js";
import * as url from 'url';
import path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server running at http:///127.0.0.1:${port}`);

    DataHandler.fillTables();
});

app.get("/", function(req, res) {
        // res.send(__filename + "\n" + __dirname);
        res.render(path.join(__dirname, "/public/views/pages/home.ejs"));
});