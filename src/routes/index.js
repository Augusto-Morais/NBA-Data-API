import express from "express";
import teamsRoutes from "./teamsRoutes.js";
import playersRoutes from "./playersRoutes.js"
import playerStatsRoutes from "./playerStatsRoutes.js";


const routes = (app) => {
    

    app.use(
        express.json(),
        teamsRoutes,
        playersRoutes,
        playerStatsRoutes
    );
};

export default routes;