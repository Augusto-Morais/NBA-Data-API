# API CLIENT para banco de dados da NBA

A aplicação consiste em uma API CLIENT similar ao Postman, no qual o usuário, para enviar uma solicitação HTTP, deve preencher o campo de entrada especificando a rota desejada.
Para esse propósito, todas as rotas possíveis da API são exibidas na aplicação:

![routes](https://github.com/S41K10/NBA-Data-API/assets/89564462/6e68f546-e622-4b43-b046-f9f1764afa19)

### Exemplos:

### Método GET

![Exemplo Get](https://github.com/S41K10/NBA-Data-API/assets/89564462/f1db7653-f81b-4f71-b3a1-6dac07a46a34)
#### Reposta:
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

### Método POST

![Exemplo Post](https://github.com/S41K10/NBA-Data-API/assets/89564462/e43f7fb6-1501-43a4-a930-a7e2c73b9fb1)

#### Reposta:

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


Ao iniciar a aplicação pela primeira vez, a criação do banco de dados e o preenchimento das tabelas serão feitos automaticamente 

### Tecnologias Utilizadas

* [NodeJS](https://nodejs.org/en)
  </br></br>
  Dependências:
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

## Dependências e Versões Necessárias

* [MySQL](https://dev.mysql.com/downloads/installer/) - Versão 8.0.35
* [NodeJS](https://nodejs.org/en) - Versão 20.9.0

### Como rodar o projeto

1. Instale o [MySQL](https://dev.mysql.com/downloads/installer/) e o [NodeJS](https://nodejs.org/en/download). Ao iniciar o MySQL Installer, selecione o tipo de Setup 'Full'.

2. Com o projeto aberto no seu editor de código-fonte, preencha o arquivo .env com seus dados de acesso MySQL
```dosini
PORT = 3000
HOST = "localhost"
USER = "yourUser"
PASSWORD = "yourPassword"
```

3. Ainda no seu editor, execute o seguinte comando no terminal

```
npm run start
```

4. A seguinte mensagem será exibida no terminal:

```
  App running at http://localhost:YourPORT
  Connected to Data Base
```
Para usar a aplicação, basta abrir o endereço exibido acima e inserir as rotas no campo de entrada.

## Problemas enfrentados

### Problema 1:
Preenchimento das tabelas do banco de dados com estatísticas das temporadas regulares dos jogadores e informações gerais sobre os times.
* Como solucionar:
  Usando o framework Axios e o jsdom, foi possível, por meio de URLs da wikipédia, obter essas informações:
  - No arquivo scraping.js (src/scraping/scraping.js), o document object model da página foi usado para obter a tabela de estatísicas de cada jogador
    por meio das classes atribuídas à ela.

    
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
  - O nome do jogador foi obtido fazendo algumas substituições na string da URL
    ```js
    const playerName = url
        .split("/")[4]
        .replace("%27", "'")
        .replace("_", " ")
        .replace("_(basketball)","");
    ```
  - O ano de temporada regular foi obtido selecionando a primeira célula da tabela de estatísticas:
      
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
  - As outras informações referentes às estatísticas do jogador foram obtidas da mesma maneira, mudando apenas o número da célula da tabela correspondente na wikipédia e substituindo os caracteres desnecessários:
   
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
  

### Problema 2:
Formatação do painel de corpo de requisição e do painel de resposta em JSON.

* Como solucionar:
  Usando o objeto document, foi possível obter o conteúdo do input de rota para formatar o corpo da requisição em json (se necessário), além de exibir a resposta com a indentação apropriada.
- No arquivo formSetUp.js (public/scripts/), o método  ```setUpBodyReqInput()```  analisa a rota no campo de entrada e realiza as formatações para cada caso específico:
     
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
A formatação para os outros tipos de método HTTP é similar ao trecho de código exibido acima

### Problema 3:
SQL query de 2 tabelas para exibir estatísticas de cada jogador corretamente.

* Como solucionar:
  Usando INNER JOIN entre as tabelas ```playerstats``` e ```team``` para obter as estatísticas do jogador, o nome time com base no id do jogador e ano de temporada regular
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
  
### Problema 4:
Interface de banco de dados de fácil uso para obter os resultados de queries, além garantir que o banco de dados tenha sido criado antes de realizar queries.

* Como solucionar:
  No arquivo dbConfig.js (src/db/), foi criado a classe ```DBInterface``` com a biblioteca ```mysql12``` e com as informações fornecidas no arquivo .env:
  
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




