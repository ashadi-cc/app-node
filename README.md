-- install instruction 

requirement:
- latest nodejs
- latest npm 

install 
- go to root folder run
- npm install
- npm install nodemon -g

run app
- copy .env.example to .env by run in terminal cp .env.example .env
- modify the .env file for database config
- npm run dev
- api available at http://localhost:3000/api/catalogs|albums|tracks|playlists|genre|moods
