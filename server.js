const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); //POUR HASH
const mysql = require('mysql2'); //Mysql

//Connexion a la base de donner
const connection = mysql.createConnection({
  host: '172.29.18.133',
  user: 'Ticket',
  password: 'passwordticket',
  database: 'TICKETS'
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
app.post('/inscription', (req, res) => {
  console.log(req.body);
  //Conditions insertion

  //Hachage mot de passe 
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //Insertion dans la base
      connection.query(
        'INSERT INTO users(nom,prenom,email,password,classe) VALUES(?,?,?,?,?)',
        [req.body.nom, req.body.prenom, req.body.email, hash, req.body.classe],
        (err, results) => {
          if (err) {
            console.log('Erreur Insertion dans la base' + err);
            res.status(500).json({ mesage: 'Erreur serveur' });
            return;
          }
          console.log('Insertion réussi');
          res.json({ message: 'Inscription reussie !' });
        }
      )
    })

})

//CONNEXION
app.post('/connexion', (req, res) => {
  console.log(req.body);

  //Récupération password dans la base pour la comparaison
  connection.query(
    'SELECT password,id FROM users WHERE email = ?',
    [req.body.email], (err, results) => {
      if (err) {
        console.log("Erreur récupération email " + err);
        return;
      }
      if (results.length == 0) {
        console.log("Erreur identifiant");
        res.json({ message: 'Identifiant ou mot de passe invalides' });
        return;
      }
      console.log(results[0]);
      //res.json({ message: 'Email trouvé' });
      let resultat = results[0];
      bcrypt.compare(req.body.password, resultat.password, (err, results) => {
        if(err){
          console.log('Erreur compare' + err);
          return;
        }
        if(results){
          console.log('Connexion réussi');
          res.json({id : resultat.id});
        }else{
          res.json({message : 'connexion echoué'});
          return;
        }
      })
    }
  )
})
