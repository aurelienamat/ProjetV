const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); //POUR HASH
const mysql = require('mysql2'); //Mysql

//Connexion a la base de donner
const connection = mysql.createConnection({
  host: '192.168.1.114',
  user: 'Ticket',
  password: 'passwordticket',
  database: 'TICKETS',
  multipleStatements: true //Pour faire plusieurs commande sql en 1fois
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
        if (err) {
          console.log('Erreur compare' + err);
          return;
        }
        if (results) {
          console.log('Connexion réussi');
          res.json({ id: resultat.id });
        } else {
          res.json({ message: 'connexion echoué' });
          return;
        }
      })
    }
  )
})

//Création ticket
// app.post('/ticket', (req,res) => {
//   console.log(req.body);
//   connection.query(
//     "UPDATE status SET status = 'encoursdevalidation' WHERE idTps = ? AND idUsers = ? ",
//     [req.body.idTps,req.body.idUsers], (err,results) => {
//       if(err){
//         console.log("Erreur " + err);
//         return;
//       }
//       if(results){
//         console.log("Changement effectué " + results);
//         res.json({message : 'Ticket crée'});
//       }else{
//         console.log('Erreur changement' + results);
//         res.json({message : 'Erreur changement'});
//       }
//     }
//   )
// })

//Modifier TP
app.post('/modifierStatus', (req, res) => {
  console.log(req.body);
  connection.query(
    "UPDATE status SET status = ? WHERE idTps = ? AND idUsers = ?;",
    [req.body.status, req.body.idTps, req.body.idUsers], (err, results) => {
      if (err) {
        console.log("Erreur " + err);
        return;
      }
      if (results) {
        console.log("Changement effectué ");
        //SELECT status FROM status WHERE idTps = ? AND idUsers = ?;
        connection.query(
          "SELECT status,idTps FROM status WHERE idTps = ? AND idUsers = ?;",
          [req.body.idTps, req.body.idUsers], (err, resultsSelect) => {
            if (err) {
              console.log("Erreur select" + err);
              res.json({ message: "Erreur" });
              return;
            }
            if (resultsSelect.length == null) {
              console.log("Not found");
              res.json({ message: "Pas trouvé" });
              return;
            } else {
              console.log(resultsSelect[0]);
              res.json(resultsSelect[0]);
            }
          }
        )
      } else {
        console.log('Erreur changement' + results);
        res.json({ message: 'Erreur changement' });
      }
    }
  )
})

//AFFICHAGE
app.post('/affichage', (req, res) => {
  //Voir si enseignant qui demande
  //Récupere la classe de l'id qui demande
  connection.query(
    "SELECT classe from status, users WHERE users.id = status.idUsers AND users.id = ?",
    [req.body.id], (err, resultat) => {
      if (err) {
        console.log('Erreur récupération classe ' + err);
        res.json(err);
      }
      if (resultat.length == 0) {
        console.log("Existe pas ");
        res.json({ message: "Existe pas" });
      } else {
        if (resultat[0].classe == 'enseignant') {  //Si c'est l'enseigna tqui demande on affiche tout
          connection.query(
            "SELECT users.nom,prenom,classe,tps.nom as tp,matiere FROM status, tps, users WHERE tps.id = status.idTps AND users.id = status.idUsers AND status.status = ?",
            [req.body.status], (err, results) => {
              if (err) {
                console.log('Erreur ' + err);
                res.json({ message: 'Erreur affichage' });
                return;
              }
              if (results.length == 0) {
                console.log("Pas trouvé affichage " + results);
                res.json({ message: 'Pas trouvé' });
                return;
              } else {
                console.log('resultat enseingnant' + JSON.stringify(results));
                res.json(results);
              }
            }
          )
        } else { //Si ce n'est pas l'enseignant alors on affiche que l'eleve
          connection.query(
            "SELECT tps.nom as tp,matiere,status FROM status, tps, users WHERE tps.id = status.idTps AND users.id = status.idUsers AND users.id = ?",
            [req.body.id], (err, results) => {
              if (err) {
                console.log('Erreur ' + err);
                res.json({ message: 'Erreur affichage' });
                return;
              }
              if (results.length == 0) {
                console.log("Pas trouvé affichage " + results);
                res.json({ message: 'Pas trouvé' });
                return;
              } else {
                console.log('résultat eleve ' ); //+ JSON.stringify(results)
                res.json(results);
              }
            }
          )
        }
      }
    }
  )
})