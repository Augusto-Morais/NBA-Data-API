import app from "./src/app.js";
import DataHandler from "./src/db/DataHandler.js";

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server running at http:///127.0.0.1:3000`);

    DataHandler.fillTables();
});