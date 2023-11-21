# CLIENT API for NBA database

The application consists of a CLIENT API similar to Postman, in which the user, to send an HTTP request, must fill in the input field specifying the desired route.
For this purpose, all possible API routes are displayed in the application:

![routes](https://github.com/S41K10/NBA-Data-API/assets/89564462/6e68f546-e622-4b43-b046-f9f1764afa19)

### Examples:

### GET method

![GET Example](https://github.com/S41K10/NBA-Data-API/assets/89564462/f1db7653-f81b-4f71-b3a1-6dac07a46a34)
#### Output:
```json
{
        "PlayerName" : "Stephen Curry"
        "Stats":{
            {
                "Year" : "2009-10",
                "Team" : "Golden State Warriors",
                "GamesPLayed" : "80",
                "GamesStarted" : "77",
                "PPG" : "17.5",
                "RPG" : "4.5",
                "APG" : "5.9",
                "SPG" : "1.9",
                "BPG" : "0.2",
                "FGP" : "46.2",
                "TPP" : "43.7",
                "FTP" : "88.5",
            },
            {
                "Year" : "2010-11",
                "Team" : "Golden State Warriors",
                "GamesPLayed" : "74",
                "GamesStarted" : "74",
                "PPG" : "18.6",
                "RPG" : "3.9",
                "APG" : "5.8",
                "SPG" : "1.5",
                "BPG" : "0.3",
                "FGP" : "48",
                "TPP" : "44.2",
                "FTP" : "93.4",
            },
            ...
}
```

### POST method

![POST Example](https://github.com/S41K10/NBA-Data-API/assets/89564462/e43f7fb6-1501-43a4-a930-a7e2c73b9fb1)

#### Output:

```json
{
                "fieldCount" : "0",
                "affectedRows" : "1",
                "insertId" : "31",
                "info" : "",
                "serverStatus" : "2",
                "warningStatus" : "0",
}
```


When starting the application for the first time, the creation of the database and filling of the tables will be done automatically

### Technologies Used

* [NodeJS](https://nodejs.org/en)
  </br></br>
  Dependencies:
    - axios (web scraping)
    - dotenv
    - ejs
    - express
    - jsdom
    - mysql12
    - nodemon
  </br>
* [Express](https://expressjs.com/pt-br/)
* [MySQL](https://dev.mysql.com/downloads/installer/)

## Required Dependencies and Versions

* [MySQL](https://dev.mysql.com/downloads/installer/) - Version 8.0.35
* [NodeJS](https://nodejs.org/en) - Version 20.9.0

### How to run the project

1. Install [MySQL](https://dev.mysql.com/downloads/installer/) and [NodeJS](https://nodejs.org/en/download). When starting the MySQL Installer, select the 'Full' Setup type.

2. With the project open in your source code editor, fill in the .env file with your MySQL access data
```dosini
PORT = 3000
HOST = "localhost"
USER = "yourUser"
PASSWORD = "yourPassword"
```

3. Still in your editor, run the following command in the terminal

```
npm run start
```

The following message will be displayed on the terminal:

```
  App running at http://localhost:YourPORT
  Connected to Data Base
```
To use the application, simply open the address shown above and enter the routes in the input field.

## Problems faced

### Problem 1:
Filling the database tables with statistics from the players' regular seasons and general information about the teams.
* How to solve:
   Using the Axios framework and jsdom, it was possible, through Wikipedia URLs, to obtain this information:
   - In the scraping.js file (src/scraping/scraping.js), the page's document object model was used to obtain the statistics table for each player
     through the classes assigned to it.

    
    ```js
    await axios
    .get(url)
    .then((response) => {
      const dom = new jsdom.JSDOM(response.data);
      const value = dom.window.document.getElementsByClassName(
        "wikitable sortable "
      );

    const regularSeasonTable = value.item(0);
    ```
  - The player name was obtained by making some replacements in the URL string
    ```js
    const playerName = url
        .split("/")[4]
        .replace("%27", "'")
        .replace("_", " ")
        .replace("_(basketball)","");
    ```
  - The regular season year was obtained by selecting the first cell of the statistics table:
      
    ```js
    const rows = regularSeasonTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const stats = new Stats();
        const cells = row.cells;

        
        stats.year = cells
          .item(0)
          .textContent.replace(/(†\n)|\n|\*|\[\w\]|(\*\n)/, "")
          .replace("–", "-");
    ```
  - The other information regarding the player's statistics was obtained in the same way, only changing the cell number of the corresponding table in Wikipedia and replacing unnecessary characters:
   
    ```js
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


    ```
  

### Problem 2:
Formatting the request body panel and the response panel in JSON.

* How to solve:
   Using the document object, it was possible to obtain the contents of the route input to format the request body in json (if necessary), in addition to displaying the response with the appropriate indentation.
- In the formSetUp.js file (public/scripts/), the ```setUpBodyReqInput()``` method analyzes the route in the input field, and performs the formatting for each specific case:
     
  ```js
     if (HTTPMethod == "POST") {
    if (/players\/$/.test(route) || /players$/.test(route)) {
      document.getElementById("reqBody").value = `{
      "Name" : "varchar(65)",
      "Position" : "varchar(2)",
      "DateOfBirth" : "dd-mm-yyyy" 
        }
      `;
    } else if (/teams\/$/.test(route) || /teams$/.test(route)) {
      document.getElementById("reqBody").value = `{
        "Name" : "varchar(50)",
        "Championships" : "int",
        "Conference" : "varchar(1)",
        "Division": "varchar(2)"
        }`;
    } else if (
      /players\/\d{1,2}\/stats$/.test(route) ||
      /players\/\d{1,2}\/stats\/$/.test(route)
    ) {
      document.getElementById("reqBody").value = `{
        "Year" : "Ex: 2015-16",
        "TeamId" : "int",
        "GamesPlayed" : "int",
        "GamesStarted" : "int",
        "PPG" : "float",
        "RPG" : "float",
        "APG" : "float",
        "SPG" : "float",
        "BPG" : "float",
        "FGP" : "float",
        "TPP" : "float",
        "FTP" : "float"
        }`;
    } else {
      document.getElementById("reqBody").value = "";
    }
  }
  
         ```
The formatting for the other HTTP method types is similar to the code snippet shown above

### Problem 3:
SQL query of 2 tables to display statistics for each player correctly.

* How to solve:
   Using INNER JOIN between ```playerstats``` and ```team``` tables to get player statistics, and team name based on player id and regular season year
  ```sql
      SELECT playerstats.Year,
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
      AND Year=${year}
  ```
  
### Problem 4:
Easy-to-use database interface to obtain query results, as well as ensuring that the database has been created before performing queries.

* How to solve:
   In the dbConfig.js file (src/db/), the ```DBInterface``` class was created with the ```mysql12``` library and with the information provided in the .env file:
  
```js
import mysql from "mysql2";
import "dotenv/config";


class DBInterface {
  constructor() {
    this.host = process.env.HOST;
    this.user = process.env.USER;
    this._password = process.env.PASSWORD;
    this.con = null;
  }

  async initConnection() {
    this.con = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this._password,
    });

    this.con.connect((err) => {
      if (err) console.log(err.message);
      else console.log("Connected to Data Base");
    });

    this.getResultsFromQuery(`CREATE DATABASE IF NOT EXISTS nba;`);
    this.getResultsFromQuery("USE nba");
  }


  endConnnection() {
    this.con.end(function (err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log("DB connection has been closed");
      }
    });
  }
  
  async getResultsFromQuery(query) {
    try {
      const results = await this.con.promise().query(query);

      return results[0];
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }

}

export default DBInterface;

```
