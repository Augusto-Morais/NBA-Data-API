import DBInterface from "../db/dbConfig.js";
import Team from "../models/Team.js";

const dbInterface = new DBInterface;

class TeamsController{
    static appGetAllTeams = async (req, res) => {
        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM team
        `);

        return result;
    }

    static getAllTeams = async (req,res) => {
        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM team
        `);

        res.json(result);

        dbInterface.endConnnection();
    }

    static getTeamById = async (req, res) => {
        dbInterface.initConnection();

        const id = req.params.id;

        const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM team WHERE TeamId=${id};
        `);

        res.status(200).json(result);

        dbInterface.endConnnection();
    }

    static addTeam = async (req, res) => {
        const newTeam = new Team(req.body.Name,
            req.body.Championships,
            req.body.Conference,
            req.body.Division);

        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            INSERT INTO team (Name, Championships, Conference, Division)
            VALUES ('${newTeam.Name}', ${newTeam.Championships}, '${newTeam.Conference}', '${newTeam.Division}')
        `);

        res.json(result);

        dbInterface.endConnnection();
    }

    static updateTeam = async (req, res) => {
        const id = req.params.id;

        const updatedTeam = new Team(req.body.Name,
            req.body.Championships,
            req.body.Conference,
            req.body.Division);

        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            UPDATE team SET Name='${updatedTeam.Name}', Championships=${updatedTeam.Championships},
            Conference='${updatedTeam.Conference}', Division='${updatedTeam.Division}'
            WHERE TeamId=${id}
        `);

        res.json(result);

        dbInterface.endConnnection();


    }

    static deleteTeam = async (req, res) => {
        const id = req.params.id;

        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            DELETE FROM team WHERE TeamId=${id}
        `);

        res.json(result);

        dbInterface.endConnnection();
    }

}

export default TeamsController;