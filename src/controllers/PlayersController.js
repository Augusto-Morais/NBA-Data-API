import DBInterface from "../db/dbConfig.js";
import Player from "../models/Player.js";

const dbInterface = new DBInterface();

class PlayersController {
  static appGetAllPlayers = async (req, res) => {
    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM player
        `);

    return result;
  };

  static getAllPlayers = async (req, res) => {
    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(`
            SELECT * FROM player
        `);

    res.status(200).json(result);
    // res.json(result);

    dbInterface.endConnnection();
  };

  static getPlayerById = async (req, res) => {
    dbInterface.initConnection();

    const id = req.params.id;

    const result = await dbInterface.getResultsFromQuery(
      `SELECT * FROM player WHERE PlayerId=${id}`
    );

    res.status(200).json(result);
    // console.log(id);

    dbInterface.endConnnection();
  };

  static addPlayer = async (req, res) => {
// d m a
    const date = req.body.DateOfBirth;//a m d  
    const formattedDate = date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0];
    
    console.log(req.body);

    const newPlayer = new Player(
      req.body.Name,
      req.body.Position,
      formattedDate
    );
    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `INSERT INTO player (Name, Position, DateOfBirth) values 
          ('${newPlayer.Name}','${newPlayer.Position}', '${newPlayer.DateOfBirth}');`
    );

    dbInterface.endConnnection();

    res.json(result);
    // let value;
    
    //   try {
    //     const newPlayer = new Player(
    //       req.body.Name,
    //       req.body.Position,
    //       req.body.DateOfBirth
    //     );
    //     dbInterface.initConnection();
  
    //     const result = await dbInterface.getResultsFromQuery(
    //       `INSERT INTO player (Name, Position, DateOfBirth) values 
    //           ('${newPlayer.Name}','${newPlayer.Position}', '${newPlayer.DateOfBirth}');`
    //     );
  
    //     value = result.;
  
    //     dbInterface.endConnnection();
    //   } catch (error) {
    //     res.json(error);
    //   }
  };

  static updatePlayer = async (req, res) => {

    const date = req.body.DateOfBirth;//a m d  
    const formattedDate = date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0];
    const id = req.params.id;
    const newPlayer = new Player(
      req.body.Name,
      req.body.Position,
      formattedDate
    );

    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `UPDATE player SET Name='${newPlayer.Name}', Position='${newPlayer.Position}', DateOfBirth='${newPlayer.DateOfBirth}' WHERE PlayerId=${id};`
    );
    res.json(result);

    dbInterface.endConnnection();
  };

  static deletePlayer = async (req, res) => {
    const id = req.params.id;

    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `DELETE from player WHERE PlayerId=${id};`
    );

    res.json(result);

    dbInterface.endConnnection();
  };
}

export default PlayersController;
