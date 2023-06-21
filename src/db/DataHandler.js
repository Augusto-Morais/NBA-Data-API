import DBInterface from "./dbConfig.js";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbInterface = new DBInterface();

class DataHandler {
  static async fillTables() {
    let fillTeam = fs
      .readFileSync(path.join(__dirname, `../sql/fillTeamTable.sql`))
      .toString();

    let fillPlayer = fs
      .readFileSync(path.join(__dirname, `../sql/fillPlayerTable.sql`))
      .toString();

    let fillPlayerStats = fs
      .readFileSync(path.join(__dirname, `../sql/fillPlayerStatsTable.sql`))
      .toString();

    dbInterface.initConnection();

    // Checking team table

    try {
      let result = await dbInterface.getResultsFromQuery("SELECT * FROM team");
    } catch (error) {
      if (error.code == "ER_NO_SUCH_TABLE") {
        dbInterface.getResultsFromQuery(`
        CREATE table IF NOT EXISTS team (
        TeamId int NOT NULL AUTO_INCREMENT,
        Name varchar(50),
        Championships int,
        Conference varchar(1),
        Division varchar(2),
        PRIMARY KEY (TeamId)
    );
    `);
        dbInterface.getResultsFromQuery(fillTeam);
      }
    }


    // Checking player table
    try {
      let result = await dbInterface.getResultsFromQuery("SELECT * FROM player");
    } catch (error) {
      if (error.code == "ER_NO_SUCH_TABLE") {
        dbInterface.getResultsFromQuery(`
        CREATE table IF NOT EXISTS player (
          PlayerId int NOT NULL AUTO_INCREMENT,
            Name varchar(65),
            Position varchar(2),
            DateOfBirth date,
            PRIMARY KEY (playerId)
        );
        `);
        dbInterface.getResultsFromQuery(fillPlayer);
      }
    }

    // Checking playerStats table
    try {
      let result = await dbInterface.getResultsFromQuery("SELECT * FROM playerstats");
    } catch (error) {
      if (error.code == "ER_NO_SUCH_TABLE") {
        dbInterface.getResultsFromQuery(`
        CREATE table IF NOT EXISTS playerStats (
          StatsId int NOT NULL AUTO_INCREMENT,
            PlayerId int,
            Year varchar(7),
            TeamId int,
            GamesPlayed int,
            GamesStarted int,
            PPG float(1),
            RPG float(1),
            APG float(1),
            SPG float(1),
            BPG float(1),
            FGP float(1),
            TPP float(1),
            FTP float(1),
            PRIMARY KEY (StatsId),
            FOREIGN KEY (PlayerId) references player(PlayerId),
            FOREIGN KEY (TeamId) references team(TeamId)
        );
        `);
        dbInterface.getResultsFromQuery(fillPlayerStats);
      }
    }
  }

  
}

export default DataHandler;
