import DBInterface from "../db/dbConfig.js";
import Player from "../models/Player.js";

const dbInterface = new DBInterface;

class PlayersController{
    static getAllPlayers = async (req,res) => {
        dbInterface.initConnection();

        const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM player
        `);

        res.json(result);

        dbInterface.endConnnection();
    }

    static getPlayerById = async (req, res) => {
        dbInterface.initConnection();

        const id = req.params.id;
        
        const result = await dbInterface.getResultsFromQuery(`SELECT * FROM player WHERE PlayerId=${id}`);
        res.json(result);
    
        dbInterface.endConnnection();
    }

    static addPlayer = async (req, res) => {
        const newPlayer = new Player(req.body.Name, req.body.Position, req.body.DateOfBirth);
        dbInterface.initConnection();
        
        const result = await dbInterface.getResultsFromQuery(
            `INSERT INTO player (Name, Position, DateOfBirth) values 
            ('${newPlayer.Name}','${newPlayer.Position}', '${newPlayer.DateOfBirth}');`
            );
        res.json(
            result
        )
        
        dbInterface.endConnnection();
    }

    static updatePlayer = async (req, res) => {
        const id = req.params.id;
        const newPlayer = new Player(req.body.Name, req.body.Position, req.body.DateOfBirth);

        dbInterface.initConnection();
        
        const result = await dbInterface.getResultsFromQuery(
            `UPDATE player SET Name='${newPlayer.Name}', Position='${newPlayer.Position}', DateOfBirth='${newPlayer.DateOfBirth}' WHERE PlayerId=${id};`
            );
        res.json(result);
    
        dbInterface.endConnnection();
    }

    static deletePlayer = async (req, res) => {
        const id = req.params.id;

        dbInterface.initConnection();
        
        const result = await dbInterface.getResultsFromQuery(
            `DELETE from player WHERE PlayerId=${id};`
            );
            
        res.json(
            result
        )

        dbInterface.endConnnection();
    }

}

export default PlayersController;