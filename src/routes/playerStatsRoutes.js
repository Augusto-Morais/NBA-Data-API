import express from "express";
import PlayerStatsController from "../controllers/PlayerStatsController.js";
import PlayersStatsController from "../controllers/PlayerStatsController.js";

const router = express.Router();

router
.get("/players/:id/stats",PlayersStatsController.getPlayerStats)
.get("/players/:id/stats/:year", PlayerStatsController.getPlayerStatsByYear)
.post("/players/:id/stats",PlayersStatsController.addPlayerStats)
.put("/players/:id/stats/:year",PlayersStatsController.updatePlayerStats)
.delete("/players/:id/stats/:year",PlayersStatsController.deletePlayerSeasonStats);

export default router;