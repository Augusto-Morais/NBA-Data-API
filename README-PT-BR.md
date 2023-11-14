# API CLIENT para banco de dados da NBA

A aplicação consiste em uma API CLIENT similar ao Postman, no qual o usuário, para enviar uma solicitação HTTP, deve preencher o campo de entrada especificando a rota desejada

Por exepmlo: 
https://dev.mysql.com/downloads/file/?id=523568



Ao iniciar a aplicação pela primeira vez, a criação do banco de dados e o preenchimento das tabelas serão feitos automaticamente 

- No site, vá no campo: Actions > Copy Markdown. Copie o link e cole no seu arquivo README.md e o diagrama estará lá.


### Tecnologias Utilizadas

Liste as tecnologias (linguagens, ferramentas, bibliotecas) que você utilizou para elaborar o projeto. Essa parte é importante para quando um recrutador (que não tem conhecimento de programação) acessar o seu projeto, ele vai saber só olhando a documentação quais tecnologias você já conhece!

Exemplo:
* [NodeJS](https://nodejs.org/en)
* [MySQL](https://www.mysql.com/)

## Dependências e Versões Necessárias

Liste as dependências necessárias para rodar o projeto e as versões que você utilizou.

* Docker - Versão: X.X

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
  Server running at http://localhost:YourPORT
  Connected to Data Base
```
Para usar a aplicação, basta abrir o endereço exibido acima e inserir as rotas no campo de entrada.
   


## Rotas da aplicação e seus retornos





## Problemas enfrentados

Liste os problemas que você enfrentou construindo a aplicação e como você resolveu cada um deles. Você que desenvolveu o projeto é a pessoa que mais conhece/entende os possíveis problemas que uma pessoa pode enfrentar rodando a aplicação. Compartilhe esse conhecimento e facilite a vida da pessoa descrevendo-os.

Exemplo:

### Problema 1:
Descrição do problema
* Como solucionar: explicar a solução.

### Problema 2:
Descrição do problema
* Como solucionar: explicar a solução.

## Próximos passos

Descreva se você pretende, pensou ou gostaria de elaborar uma nova feature para o seu projeto definindo os próximos passos.




