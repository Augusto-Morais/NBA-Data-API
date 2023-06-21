import express from "express";
import TeamsController from "../controllers/TeamsController.js";

const router = express.Router();

router
.get("/teams", TeamsController.getAllTeams)
.get("/teams/:id", TeamsController.getTeamById)
.post("/teams", TeamsController.addTeam)
.put("/teams/:id", TeamsController.updateTeam)
.delete("/teams/:id", TeamsController.deleteTeam)


export default router;