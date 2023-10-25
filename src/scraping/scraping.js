import axios from "axios";
import jsdom from "jsdom";
import fs, { stat } from "fs";
import teamsController from "../controllers/TeamsController.js";
import playersController from "../controllers/PlayersController.js"

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
      const value = dom.window.document.getElementsByClassName(
        "wikitable sortable "
      );
      console.log(url);
      const regularSeasonTable = value.item(0);

      const table = [];

      const playerName = url
        .split("/")[4]
        .replace("%27", "'")
        .replace("_", " ")
        .replace("_(basketball)","");

        console.log(playerName);

      const rows = regularSeasonTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const stats = new Stats();
        const cells = row.cells;

        const teamName = /Team|\d/.test(
          cells.item(1).textContent.replace("\n", "")
        )
          ? null
          : cells.item(1).textContent.replace("\n", "");

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


        if (/\d{4}.{1}\d{2}/.test(stats.year)) {
          table.push(stats);
        }
      });

      table.forEach((stats) => {

        fs.appendFileSync(
          "../sql/testing.sql",
          `(${stats.playerId}, '${stats.year}', ${stats.teamId}, ${stats.gamesPlayed}, ${stats.gamesStarted}, ${stats.ppg}, ${stats.rpg}, ${stats.apg}, ${stats.spg}, ${stats.bpg}, ${stats.fgp}, ${stats.tpp}, ${stats.ftp}),\n`,
          "UTF-8"
        );

      });

    })
    .catch((err) => {
      console.log(err);
      console.log(`=========================ERROR: ${url}`);
    });
}
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
});

