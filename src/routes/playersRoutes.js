import express from "express";
import PlayersController from "../controllers/PlayersController.js";


const router = express.Router();

router
.get("/players",PlayersController.getAllPlayers)
.get("/players/:id", PlayersController.getPlayerById)
.post("/players",PlayersController.addPlayer)
.put("/players/:id", PlayersController.updatePlayer)
.delete("/players/:id",PlayersController.deletePlayer)

export default router;