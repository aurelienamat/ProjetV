const express = require('express');
const app = express();

const mysql = require('mysql2');

//Connexion a la base de donner
const connection = mysql.createConnection({
    host:'172.29.18.133',
    user:'Ticket',
    password:'passwordticket',
    database:'TICKETS'
});
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});


app.use(express.json()); //Sert a utiliser json


//Lire sur le port 3000
app.listen(3000, () => {
    console.log('Server is running on :3000');
})