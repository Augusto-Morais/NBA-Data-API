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

Liste as dependências necessárias para rodar o projeto e as versões que você utilizou.

* [MySQL](https://dev.mysql.com/downloads/installer/) - Versão 8.0.35
* [NodeJS](https://nodejs.org/en) - Versão 20.9.0

### Como rodar o projeto

1. Instale o [MySQL](https://dev.mysql.com/downloads/installer/) e o [NodeJS](https://nodejs.org/en/download). Ao iniciar o MySQL Installer, selecione o tipo de Setup 'Full'.

2. Com o projeto aberto no seu editor de código-fonte,  preencha o arquivo .env com seus dados de acesso MySQL
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
  Usando o framework Axios e o jsdom, foi possível, por meio de URLs da wikipedia, obter essas informações:
  - No arquivo scraping.js (src/scraping/scraping.js), o document object model da página foi usado para obter a tabela de estatísicas de cada jogador
    por meio das classes atribuídas à ela .

    
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
  - O nome do jogador foi obtido fazendo algumas substiuições na string da URL
    ```js
    const playerName = url
        .split("/")[4]
        .replace("%27", "'")
        .replace("_", " ")
        .replace("_(basketball)","");
    ```
  

### Problema 2:
Descrição do problema
* Como solucionar: explicar a solução.





