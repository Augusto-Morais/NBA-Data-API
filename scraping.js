import axios from "axios";
import jsdom from "jsdom";
import fs, { stat } from "fs";
import teamsController from "./src/controllers/TeamsController.js";
import playersController from "./src/controllers/PlayersController.js";
import { log, table } from "console";
// ' = %27
const teams = await teamsController.appGetAllTeams();
const players = await playersController.appGetAllPlayers();

const teamsIds = new Map();
teams.map((team) => {
  teamsIds.set(team.Name, team.TeamId);
});

const playersIds = new Map();
players.map((player) => {
  playersIds.set(player.Name, player.PlayerId);
});

// console.log(teamsIds);
// console.log(playersIds);

// ('Boston Celtics', 17,'E','A'),
// ('Brooklyn Nets', 0, 'E','A'),
// ('New York Knicks', 2, 'E','A'),
// ('Philadelphia 76ers', 3,'E','A'),
// ('Toronto Raptors', 1, 'E','A'),
// ('Chicago Bulls', 6, 'E','C'),
// ('Cleveland Cavaliers', 1,'E','C'),
// ('Detroit Pistons', 3, 'E','C'),
// ('Indiana Pacers', 0, 'E','C'),
// ('Milwaukee Bucks', 2,'E','C'),
// ('Atlanta Hawks', 1, 'E','SE'),
// ('Charlotte Hornets', 0, 'E','SE'),
// ('Miami Heat', 3,'E','SE'),
// ('Orlando Magic', 0, 'E','SE'),
// ('Washington Wizards', 1, 'E','SE'),
// ('Denver Nuggets', 1,'W','NW'),
// ('Minnesota Timberwolves', 0, 'W','NW'),
// ('Oklahoma City Thunder', 1, 'W','NW'),
// ('Portland Trail Blazers', 1,'W','NW'),
// ('Utah Jazz', 0, 'W','NW'),
// ('Golden State Warriors', 7, 'W','P'),
// ('Los Angeles Clippers', 0,'W','P'),
// ('Los Angeles Lakers', 17, 'W','P'),
// ('Phoenix Suns', 0, 'W','P'),
// ('Sacramento Kings', 1,'W','P'),
// ('Dallas Mavericks', 1, 'W','SW'),
// ('Houston Rockets', 2, 'W','SW'),
// ('Memphis Grizzlies', 0, 'W','SW'),
// ('New Orleans Pelicans', 0, 'W','SW'),
// ('San Antonio Spurs', 5, 'W','SW');
// const teamsReference =
const teamsReference = new Map();

teamsReference.set("Sacramento", "Sacramento Kings");
teamsReference.set("Golden State", "Golden State Warriors");
teamsReference.set("Philadelphia", "Philadelphia 76ers");
teamsReference.set("Minnesota", "Minnesota Timberwolves");
teamsReference.set("Detroit", "Detroit Pistons");
teamsReference.set("Denver", "Denver Nuggets");
teamsReference.set("Chicago", "Chicago Bulls");
teamsReference.set("Cleveland", "Cleveland Cavaliers");
teamsReference.set("Oklahoma City", "Oklahoma City Thunder");
teamsReference.set("Atlanta", "Atlanta Hawks");
teamsReference.set("L.A. Lakers", "Los Angeles Lakers");
teamsReference.set("Milwaukee", "Milwaukee Bucks");
teamsReference.set("Houston", "Houston Rockets");
teamsReference.set("Orlando", "Orlando Magic");
teamsReference.set("Washington", "Washington Wizards");
teamsReference.set("New Orleans", "New Orleans Pelicans");
teamsReference.set("Charlotte", "Charlotte Hornets");
teamsReference.set("Phoenix", "Phoenix Suns");
teamsReference.set("Memphis", "Memphis Grizzlies");
teamsReference.set("Dallas", "Dallas Mavericks");
teamsReference.set("San Antonio", "San Antonio Spurs");
teamsReference.set("Toronto", "Toronto Raptors");
teamsReference.set("Portland", "Portland Trail Blazers");
teamsReference.set("Utah", "Utah Jazz");
teamsReference.set("Indiana", "Indiana Pacers");
teamsReference.set("L.A. Clippers", "Los Angeles Clippers");
teamsReference.set("Miami", "Miami Heat");
teamsReference.set("New York", "New York Knicks");
teamsReference.set("Brooklyn", "Brooklyn Nets");
teamsReference.set("Boston", "Boston Celtics");

class Stats {
  constructor(
    playerId,
    year,
    teamId,
    gamesPlayed,
    gamesStarted,
    ppg,
    rpg,
    apg,
    spg,
    bpg,
    fgp,
    tpp,
    ftp
  ) {
    this.playerId = playerId;
    this.year = year;
    this.teamId = teamId;
    this.gamesPlayed = gamesPlayed;
    this.gamesStarted = gamesStarted;
    this.ppg = ppg;
    this.rpg = rpg;
    this.apg = apg;
    this.spg = spg;
    this.bpg = bpg;
    this.fgp = fgp;
    this.tpp = tpp;
    this.ftp = ftp;
  }
}

async function scrapeAndWritePlayerStats(url) {
  await axios
    .get(url)
    .then((response) => {
      const dom = new jsdom.JSDOM(response.data);
      // const something = dom.window.document.querySelectorAll(`table[class="wikitable sortable jquery-tablesorter"]`);
      // const second = dom.window.document.querySelectorAll(".wikitable .sortable .jquery-tablesorter");
      const value = dom.window.document.getElementsByClassName(
        "wikitable sortable "
      );
      console.log(url);
      const regularSeasonTable = value.item(0);
      // console.log(something);
      // console.log(regularSeasonTable);
      // value.forEach((element) => {
      //     console.log(element);
      // })

      const table = [];

      // if(url == "https://en.wikipedia.org/wiki/Anthony_Edwards_(basketball)"){}
      const playerName = url
        .split("/")[4]
        .replace("%27", "'")
        .replace("_", " ")
        .replace("_(basketball)","");

        console.log(playerName);

      const rows = regularSeasonTable.querySelectorAll("tr");
      // console.log(rows);
      rows.forEach((row) => {
        const stats = new Stats();
        // console.log(row);
        const cells = row.cells;
        //   for (let index = 0; index < cells.length; index++) {
        //     // console.log("|" + cells.item(index).textContent);
        //   }

        const teamName = /Team|\d/.test(
          cells.item(1).textContent.replace("\n", "")
        )
          ? null
          : cells.item(1).textContent.replace("\n", "");

        // console.log(teamName);

        // console.log("=====" + cells.item(0).textContent);
        stats.playerId = playersIds.get(playerName);
        stats.teamId = teamsIds.get(teamsReference.get(teamName));
        stats.year = cells
          .item(0)
          .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
          .replace("–", "-");
        stats.gamesPlayed = cells
          .item(2)
          .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "");
        stats.gamesStarted = cells
          .item(3)
          .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "");
        stats.ppg = /\./.test(
          cells
            .item(cells.length - 1)
            .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")[0]
        )
          ? "0".concat(
              cells
                .item(cells.length - 1)
                .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
            )
          : cells
              .item(cells.length - 1)
              .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
              .replace("\n", "");
        stats.fgp = new Number(
          cells.item(5).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "") *
            100
        )
          .toPrecision(3)
          .toString();
        stats.tpp = new Number(
          cells.item(6).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "") *
            100
        )
          .toPrecision(3)
          .toString();
        // stats.ftp = new Number(cells.item(7).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "") * 100).toPrecision(3).toString();
        stats.ftp = new Number(
          cells.item(7).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "") *
            100
        )
          .toPrecision(3)
          .toString();

        stats.rpg = /\./.test(
          cells.item(8).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")[0]
        )
          ? "0".concat(
              cells
                .item(8)
                .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
                .replace("\n", "")
            )
          : cells
              .item(8)
              .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
              .replace("\n", "");
        stats.apg = /\./.test(
          cells.item(9).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")[0]
        )
          ? "0".concat(
              cells
                .item(9)
                .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
                .replace("\n", "")
            )
          : cells
              .item(9)
              .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
              .replace("\n", "");
        stats.spg = /\./.test(
          cells.item(10).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")[0]
        )
          ? "0".concat(
              cells
                .item(10)
                .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
                .replace("\n", "")
            )
          : cells
              .item(10)
              .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
              .replace("\n", "");
        stats.bpg = /\./.test(
          cells.item(11).textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")[0]
        )
          ? "0".concat(
              cells
                .item(11)
                .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
                .replace("\n", "")
            )
          : cells
              .item(11)
              .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
              .replace("\n", "");

        // fs.writeFileSync("./src/sql/testing.sql", `${stats}\n`, "UTF-8",{'flags': 'w+'});
        //     PlayerId, Year, TeamId, GamesPlayed,
        // GamesStarted,
        // 	PPG, RPG, APG, SPG, BPG, FGP, TPP, FTP

        // console.log(typeof stats.year);

        if (/\d{4}.{1}\d{2}/.test(stats.year)) {
          table.push(stats);
        }
      });

      table.forEach((stats) => {
        //   if (table.indexOf(stats) == table.length - 1) {
        //     fs.appendFileSync(
        //       "./src/sql/testing.sql",
        //       `(21, '${stats.year}',21, ${stats.gamesPlayed}, ${stats.gamesStarted}, ${stats.ppg}, ${stats.rpg}, ${stats.apg}, ${stats.spg}, ${stats.bpg}, ${stats.fgp}, ${stats.tpp}, ${stats.tpp});`,
        //       "UTF-8"
        //     );
        //   } else {
        //     fs.appendFileSync(
        //       "./src/sql/testing.sql",
        //       `(21, '${stats.year}',21, ${stats.gamesPlayed}, ${stats.gamesStarted}, ${stats.ppg}, ${stats.rpg}, ${stats.apg}, ${stats.spg}, ${stats.bpg}, ${stats.fgp}, ${stats.tpp}, ${stats.tpp}),\n`,
        //       "UTF-8"
        //     );
        //   }

        fs.appendFileSync(
          "./src/sql/testing.sql",
          `(${stats.playerId}, '${stats.year}', ${stats.teamId}, ${stats.gamesPlayed}, ${stats.gamesStarted}, ${stats.ppg}, ${stats.rpg}, ${stats.apg}, ${stats.spg}, ${stats.bpg}, ${stats.fgp}, ${stats.tpp}, ${stats.ftp}),\n`,
          "UTF-8"
        );

        // if(stats.year == "2015-16"){

        // }
        // console.log(/(†\n)|\n|\*|\[\w\]|(\*\n)/.test(stats.ppg) + `==${stats.ppg}` );

        // console.log(stats.ftp);
        //   console.log(stats);
      });
      // console.log("|" + url.split("/")[4].replace("%27","'").replace("_"," ") + "|");
    })
    .catch((err) => {
      console.log(err);
      console.log(`=========================ERROR: ${url}`);
    });
}
// [class="wikitable sortable jquery-tablesorter"]

// scrapeAndWritePlayerStats(
//   "https://en.wikipedia.org/wiki/Giannis_Antetokounmpo"
// );
// https://en.wikipedia.org/wiki/Devin_Vassell
// https://en.wikipedia.org/wiki/Stephen_Curry
// https://en.wikipedia.org/wiki/De%27Aaron_Fox
// https://en.wikipedia.org/wiki/Shai_Gilgeous-Alexander
// https://en.wikipedia.org/wiki/Mikal_Bridges
// https://en.wikipedia.org/wiki/Jalen_Brunson
// https://en.wikipedia.org/wiki/Giannis_Antetokounmpo
// https://en.wikipedia.org/wiki/Jayson_Tatum
// console.log(players);
let count = 0;
players.forEach((player) => {
  try {
    const playerName = player.Name;

    let partUrl;

    if (player.Name == "Anthony Edwards") {
      partUrl =
        "https://en.wikipedia.org/wiki/" +
        "Anthony_Edwards_(basketball)";
    } else {
      partUrl =
      "https://en.wikipedia.org/wiki/" +
      playerName.replace(" ", "_").replace("'", "%27");
    }

    scrapeAndWritePlayerStats(partUrl);

    
  } catch (error) {
    console.log(player.Name);
  }
  // console.log(partUrl);
  //   san antonio spurs ajustar nome do time no bd
  //   Devin vassel ajustar nome do jogador no bd
});

// Jayson Tatum
// Mikal Bridges ----
// Jalen Brunson ----
// Joel Embiid
// Pascal Siakam
// Zach LaVine
// Donovan Mitchell
// Cade Cunningham
// Tyrese Haliburton
// Giannis Antetokounmpo ----
// Trae Young
// LaMelo Ball
// Jimmy Butler
// Paolo Banchero
// Bradley Beal
// Nikola Jokic
// Anthony Edwards
// Shai Gilgeous-Alexander ----
// Damian Lillard
// Lauri Markkanen
// Stephen Curry ----
// Kawhi Leonard
// LeBron James
// Devin Booker
// De'Aaron Fox ----
// Luka Doncic ----
// Jalen Green
// Ja Morant
// Brandom Ingram
// Devin Vassel
