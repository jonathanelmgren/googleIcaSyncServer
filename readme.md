# Getting Started

Projektet är byggt i Node.JS, med en server.js innehållandes mongoose och express och en service.js som sköter synkningen mellan Google och ICA

## Starta

1. Du behöver installera Node samt NPM och OPTIONAL: MongoDB till din dator
2. Gå till mappen där du har koden och skriv `npm install` i terminalen, du har nu installerat alla beroenden till projektet
3. Skapa en .env fil i root av projektet och fyll i följande:

`ICA_API_URL = https://handla.api.ica.se/api`
`API_URL = http://localhost:3001`

`GOOGLE_USER = ettgooglekonto // OBS UTAN 2-STEGSVERIFIERING`
`GOOGLE_PASS = ettgooglelösenord`

`ACCESS_TOKEN_SECRET = ENACCESSTOKENSECRET`
`HASHED = ENHASH`
`ALGORITHM = DINALGORITM`
`IV = ETTNUMMER`

Det finns två vägar att gå, via mongodb samt utan.


### Utan MongoDB

I service.js byter du ut
`const { data } = await APIService.getUsers()`
Mot en lista av objekt:
`const users = [{_id: randomnummer, ica_user: {iv: KRYPTERAT, content: KRYPTERAT}, ica_pass: {iv: KRYPTERAT, content: KRYPTERAT}, subscription_end_date: "2050-01-01"}]`
Du måste även ta bort alla API-anrop som görs i applikationen.


### Med MongoDB

Ladda ned MongoDB
Starta server med `node server.js` i terminalen
Gör sedan POST-anrop för att skapa din användare följt av ett PUT-anrop för att lägga in dina ICA inloggningsuppgifter.

### Google

Nu har du skapat en användare med korrekt uppgifter och skrivit in ICA-inloggningsuppgifter.

Du behöver nu antingen använda ditt primära Google-konto i .env filen alternativt skapa ett nytt konto och dela inköpslistan från din primära lista till det nya kontot. Döp sedan inköpslistan till ditt _id.

### `node service.js`

Skriv nu `node service.js` i terminalen och du skall vara good to go. Den synkar var 3:e minut 

## Starta om

Om din server dör av någon anledning, du startar om din dator eller dylikt så räcker det att öppna terminalen och skriva `node server.js` samt `node service.js` så är allt igång igen