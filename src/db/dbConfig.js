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

  // // create the connection to database
  // const connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   database: 'test'
  // });

  // // simple query
  // connection.query(
  //   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
  //   function(err, results, fields) {
  //     console.log(results); // results contains rows returned by server
  //     console.log(fields); // fields contains extra meta data about results, if available
  //   }
  // );
}

export default DBInterface;
