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

app.use(express.static('html')); //Selection du dossier html
app.use(express.json()); //Sert a utiliser json


//Lire sur le port 3000
app.listen(3000, () => {
    console.log('Server is running on :3000');
})


//Gestion Inscription Utilisateur
app.post('/inscription', (req,res) => {
  console.log(req.body);
  //Conditions insertion
  
  //Hachage mot de passe 
  
  //Insertion dans la base
  connection.query(
    'INSERT INTO users(nom,prenom,email,password,classe) VALUES(?,?,?,?,?)',
    [req.body.nom,req.body.prenom,req.body.email,req.body.password,req.body.classe],
    (err,results) => {
      if(err){
        console.log('Erreur Insertion dans la base' + err);
        res.status(500).json({mesage : 'Erreur serveur'});
        return;
      }
      console.log('Insertion réussi');
      res.json({message : 'Inscription reussie !'});
    }
  )
})
