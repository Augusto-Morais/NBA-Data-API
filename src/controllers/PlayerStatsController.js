import DBInterface from "../db/dbConfig.js";
import PlayerStats from "../models/PlayerStats.js";

const dbInterface = new DBInterface();

class PlayerStatsController {
  static getPlayerStats = async (req, res) => {
    const id = req.params.id;

    dbInterface.initConnection();

    const playerName = await dbInterface.getResultsFromQuery(`
        SELECT Name from player WHERE PlayerId=${id};
    `);

    const stats = await dbInterface.getResultsFromQuery(
      `select playerstats.Year,
      team.Name AS Team,
      playerstats.GamesPLayed,
      playerstats.GamesStarted,
      playerstats.PPG,
      playerstats.RPG,
      playerstats.APG,
      playerstats.SPG,
      playerstats.BPG,
      playerstats.FGP,
      playerstats.TPP,
      playerstats.FTP
FROM playerstats
INNER JOIN team ON playerstats.TeamId=team.TeamId
WHERE PlayerId=${id};`
    );

    const result = {
      PlayerName: playerName[0].Name,
      Stats: stats,
    };

    res.json(result);

    dbInterface.endConnnection();
  };

  //Fix it =====
  static getPlayerStatsByYear = async (req, res) => {
    const id = req.params.id;
    const year = req.params.year;

    dbInterface.initConnection();

    const playerName = await dbInterface.getResultsFromQuery(`
        SELECT Name from player WHERE PlayerId=${id};
    `);

    const stats = await dbInterface.getResultsFromQuery(
      `select playerstats.Year,
      team.Name AS Team,
      playerstats.GamesPLayed,
      playerstats.GamesStarted,
      playerstats.PPG,
      playerstats.RPG,
      playerstats.APG,
      playerstats.SPG,
      playerstats.BPG,
      playerstats.FGP,
      playerstats.TPP,
      playerstats.FTP
FROM playerstats
INNER JOIN team ON playerstats.TeamId=team.TeamId
WHERE PlayerId=${id}
AND Year='${year}';`
    );
    // console.log(year);

    const result = {
      PlayerName: playerName[0].Name,
      Stats: stats,
    };
    
    res.json(result);

    dbInterface.endConnnection();
  };

  static addPlayerStats = async (req, res) => {
    const playerId = req.params.id;

    const newPlayerStats = new PlayerStats(
      req.body.Year,
      req.body.TeamId,
      req.body.GamesPlayed,
      req.body.GamesStarted,
      req.body.PPG,
      req.body.RPG,
      req.body.APG,
      req.body.SPG,
      req.body.BPG,
      req.body.FGP,
      req.body.TPP,
      req.body.FTP
    );
    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `INSERT INTO playerstats (PlayerId, Year, TeamId, GamesPlayed, GamesStarted,
        PPG, RPG, APG, SPG, BPG, FGP, TPP, FTP) values 
             (${playerId}, '${newPlayerStats.Year}', ${newPlayerStats.TeamId},
             ${newPlayerStats.GamesPlayed}, ${newPlayerStats.GamesStarted}, ${newPlayerStats.PPG},
             ${newPlayerStats.RPG}, ${newPlayerStats.APG}, ${newPlayerStats.SPG}, ${newPlayerStats.BPG},
             ${newPlayerStats.FGP}, ${newPlayerStats.TPP}, ${newPlayerStats.FTP});`
    );

    res.json(result);

    dbInterface.endConnnection();
  };

  static updatePlayerStats = async (req, res) => {
    const id = req.params.id;
    const year = req.params.year;

    console.log(year);

    const updatedPlayerStats = new PlayerStats(
      req.body.Year,
      req.body.TeamId,
      req.body.GamesPlayed,
      req.body.GamesStarted,
      req.body.PPG,
      req.body.RPG,
      req.body.APG,
      req.body.SPG,
      req.body.BPG,
      req.body.FGP,
      req.body.TPP,
      req.body.FTP
    );

    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `UPDATE playerstats SET Year='${updatedPlayerStats.Year}', TeamId=${updatedPlayerStats.TeamId}, GamesPLayed=${updatedPlayerStats.GamesPlayed}, GamesStarted=${updatedPlayerStats.GamesStarted},
        PPG=${updatedPlayerStats.PPG}, RPG=${updatedPlayerStats.RPG}, APG=${updatedPlayerStats.APG}, SPG=${updatedPlayerStats.SPG}, BPG=${updatedPlayerStats.BPG}, FGP=${updatedPlayerStats.FGP}, TPP=${updatedPlayerStats.TPP}, 
        FTP=${updatedPlayerStats.FTP} WHERE PlayerId=${id} AND Year='${year}';`
    );

    res.json(result);

    dbInterface.endConnnection();
  };

  static deletePlayerSeasonStats = async (req, res) => {
    const id = req.params.id;
    const year = req.params.year;

    dbInterface.initConnection();

    const result = await dbInterface.getResultsFromQuery(
      `DELETE from playerstats WHERE PlayerId=${id} AND Year='${year}';`
    );
    res.json(result);

    dbInterface.endConnnection();
  };
}

export default PlayerStatsController;
