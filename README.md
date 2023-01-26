# ReDos (Regex Expression Denail of Service)

Este repositório contém o exemplo utilizado no artigo publicado na plataforma dev.to sobre como se proteger de um ataque de negação de serviço baseado em regex.

Você pode conferir o artigo clicando aqui:

# Como executar o projeto

Para executar este projeto é bem simples, basta digitar:

 - npm i
 - node index.js
 

Caso você queira rodar os testes de carga será necessário instalar o framework de teste de load K6. Mais informações sobre ele  [AQUI](https://k6.io/)

# Estrutura do projeto

Essa api é bem simples e possui 3 endpoints, sendo eles:

 - **/validate-form-unsafe**: Esse endpoint utiliza as formas erradas de se utilizar regex para fazer validações. É utilizado para mostrar como isso pode afetar negativamente o sistema.

 - **/validate-form-safe**: Esse endpoint é utilizado para testar se a proposta de solução apresentada no artigo de fato funciona.

 - **/test-server**: Esse endpoint é utilizado para testar a responsividade da API

 
Bom é isso, espero que isso possa lhe ajudar de alguma forma 🙂. Me segue lá no dev.to e github para mais conteúdo como esse 😃 

[Dev.to 🙂](https://dev.to/r9n)
[GitHub 🙂](https://github.com/R9n)
[Npm 🙂 ](https://www.npmjs.com/~r9n)