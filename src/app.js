import express from "express";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
routes(app);



// dbinterface.initConnection();

// let result = await dbinterface.getResultsFromQuery("create table jogadores(nome varchar(40))");
// console.log(result);

// result = await dbinterface.getResultsFromQuery("describe jogadores");
// console.log(result);

export default app;