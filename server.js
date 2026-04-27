//.env
require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); //POUR HASH
const mysql = require('mysql2'); //Mysql
//Token
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static('html')); //Selection du dossier html
app.use(express.json()); //Sert a utiliser json

//Connexion a la base de donner
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true //Pour faire plusieurs commande sql en 1fois
});
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});


//Lire sur le port 3000
app.listen(3000, () => {
  console.log('Server is running on :3000');
})


//Gestion Inscription Utilisateur
app.post('/inscription', (req, res) => {
  //console.log(req.body);
  //Verification insertion
  if (req.body.password.length < 8) {
    res.json({ message: 'Mot de passe invalide', error: "length" });
    return;
  }
  if (!/[A-Z]/.test(req.body.password)) {
    res.json({ message: 'Mot de passe invalide', error: "Majuscule" });
    return;
  }
  if (!/[a-z]/.test(req.body.password)) {
    res.json({ message: 'Mot de passe invalide', error: "Minuscule" });
    return;
  }
  if (!/[0-9]/.test(req.body.password)) {
    res.json({ message: 'Mot de passe invalide', error: "Chiffre" });
    return;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.password)) {
    res.json({ message: 'Mot de passe invalide', error: "Carractère spécial" });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    res.json({ message: 'Email invalide' });
    return;
  }

  //Hachage mot de passe 
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      if (req.body.classe != 'ciel1' && req.body.classe != 'ciel2') {
        res.json({ message: 'err classe inconnu' });
        return;
      }
      //Insertion dans la base
      connection.query(
        'INSERT INTO users(nom,prenom,email,password,classe) VALUES(?,?,?,?,?)',
        [req.body.nom, req.body.prenom, req.body.email, hash, req.body.classe],
        (err, results) => {
          if (err) {
            console.log('Erreur Insertion dans la base ' + err);
            res.status(500).json({ message: 'Erreur bdd insertion', erreur: err });
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
  //console.log(req.body);

  //Récupération password dans la base pour la comparaison
  connection.query(
    'SELECT password,id,classe FROM users WHERE email = ?',
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
      //console.log(results[0]);
      //res.json({ message: 'Email trouvé' });
      let resultat = results[0];
      bcrypt.compare(req.body.password, resultat.password, (err, results) => {
        if (err) {
          console.log('Erreur compare' + err);
          res.json({ message: 'err hash' });
          return;
        }
        if (results) {
          console.log('Connexion réussi id : ' + resultat.id);

          //Creation du token
          const token = jwt.sign(
            { id: resultat.id, classe: resultat.classe },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
          );

          res.cookie('authtoken', token, {
            httpOnly: true, //empêche le JavaScript d'accéder au cookie, donc protège contre le XSS
            secure: true, // force le cookie à passer uniquement en HTTPS si true                         !!! attention à mettre true en production !!!
            sameSite: 'strict', //protège contre les attaques CSRF.
            maxAge: 30 * 24 * 60 * 60 * 1000
            //maxAge : 10 * 1000
          })

          res.json({ message: "connexion reussi", classe: resultat.classe, idUsers: resultat.id });

          // res.json({ id: resultat.id });

          // isEnseignant(resultat.id, function (classe) {
          //   if (classe == 'enseignant') {
          //     console.log('enseignant')
          //     res.json({ classe: 'enseignant', idUsers: resultat.id });
          //   } else if (classe == 'ciel1' || classe == 'ciel2') {
          //     console.log('Eleve');
          //     res.json({ classe: 'Eleve', idUsers: resultat.id });
          //   } else {
          //     console.log('err');
          //     res.json({ classe: 'Aucune classe' });
          //   }
          // })

        } else {
          res.json({ message: 'connexion echoué' });
          return;
        }
      })
    }
  )
})

app.post('/isConnect', verifToken, (req, res) => {
  console.log('Déjà connecté id : ' + req.user.id + ' classe : ' + req.user.classe);
  res.json({ message: 'Connecté', classe: req.user.classe });
})

app.post('/deconnexion', verifToken, (req, res) => {
  res.clearCookie('authtoken');
  console.log("l'id " + req.user.id + " se déco");
  res.json({ message: 'Déconnecté' });
});

//Modifier TP
app.post('/modifierStatus', verifToken, (req, res) => {
  //console.log(req.body);

  //Protection pour que seul l'enseignant peut modifier les tps des autres
  if (req.user.classe != 'enseignant') {
    connection.query(
      "UPDATE status SET status = ? WHERE idTps = ? AND idUsers = ?;",
      [req.body.status, req.body.idTps, req.user.id], (err, results) => {//L'eleve ne peut modifier que ses tps
        if (err) {
          console.log("Erreur " + err);
          return;
        }
        if (results) {
          console.log("Changement effectué ");
          //SELECT status FROM status WHERE idTps = ? AND idUsers = ?;
          //Juste pour vérifier si le changement a bien été effectué
          connection.query(
            "SELECT status,idTps FROM status WHERE idTps = ? AND idUsers = ?;",
            [req.body.idTps, req.body.idUsers], (err, resultsSelect) => {
              if (err) {
                console.log("Erreur select" + err);
                res.json({ message: "Erreur" });
                return;
              }
              if (resultsSelect.length == 0) {
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
  } else { //Si c'est un enseingnant alors il peut modifier les tps de tout le monde
    connection.query(
      "UPDATE status SET status = ? WHERE idTps = ? AND idUsers = ?;",
      [req.body.status, req.body.idTps, req.body.idUsers], (err, results) => {//On en peut pas remplacer idUsers par req.user.id car l'enseingnant peut vvalier les tps des autres
        if (err) {
          console.log("Erreur " + err);
          return;
        }
        if (results) {
          console.log("Changement effectué ");
          //SELECT status FROM status WHERE idTps = ? AND idUsers = ?;
          //Juste pour vérifier si le changement a bien été effectué
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
  }



})

//AFFICHAGE
app.post('/affichage', verifToken, (req, res) => {
  //Voir si enseignant qui demande
  //Récupere la classe de l'id qui demande

  if (req.user.classe == 'enseignant') { //ENSEINGNANT
    //console.log('enseignant');
    connection.query(
      "SELECT users.nom,prenom,classe,tps.nom as tp,matiere,idTps,idUsers,status FROM status, tps, users WHERE tps.id = status.idTps AND users.id = status.idUsers AND status.status = ?",
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
          console.log('resultat enseingnant');
          res.json(results);
        }
      }
    )
  } else if (req.user.classe == 'ciel1' || req.user.classe == 'ciel2') { //ELEVE
    connection.query(
      "SELECT tps.nom as tp,matiere,status,avancement,status.idTps,enseignant FROM status, tps, users WHERE tps.id = status.idTps AND users.id = status.idUsers AND users.id = ?",
      [req.user.id], (err, results) => {
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
          console.log('résultat eleve '); //+ JSON.stringify(results)
          res.json(results);
        }
      }
    )
  }

})

//AVANCEMENT
app.post('/graphAvancement', verifToken, (req, res) => {
  connection.query(
    //New requette avec ajout du nombre de tp valide hors avancement
    //SELECT matiere,COUNT(CASE WHEN status.status = 'valide' AND tps.avancement = 'pasafaire' THEN 1 END) as nbValideHorsAvancement,COUNT(CASE WHEN tps.avancement ='afaire' THEN 1 END) as nbTp, COUNT(CASE WHEN status.status = 'valide' AND tps.avancement = 'afaire' THEN 1 END) as nbValide FROM tps,status WHERE tps.id = status.idTps AND status.idUsers = 2  GROUP BY matiere
    //ancienne requette
    //SELECT matiere,COUNT(CASE WHEN status.status = 'valide' THEN 1 END) as nbValide,COUNT(CASE WHEN tps.avancement ='afaire' THEN 1 END) as nbTp FROM tps,status WHERE tps.id = status.idTps AND status.idUsers = ? AND tps.avancement = 'afaire' GROUP BY matiere
    "SELECT matiere,COUNT(CASE WHEN status.status = 'valide' AND tps.avancement = 'pasafaire' THEN 1 END) as nbValideHorsAvancement,COUNT(CASE WHEN tps.avancement ='afaire' THEN 1 END) as nbTp, COUNT(CASE WHEN status.status = 'valide' AND tps.avancement = 'afaire' THEN 1 END) as nbValide FROM tps,status WHERE tps.id = status.idTps AND status.idUsers = ?  GROUP BY matiere",
    [req.user.id], (err, results) => {
      if (err) {
        console.log('Erreur graphAvancement');
        res.json({ message: 'Erreur graphAvancement' });
        return;
      }
      if (results.length == 0) {
        console.log('Resultat requette vide');
        res.json({ message: 'Resultat requette vide' });
        return;
      }
      res.json(results);
    }
  )
})


// AVANCEMENT GERER PAR LE PROF
app.post('/avancement', verifToken, (req, res) => {

  if (req.user.classe != 'enseignant') {
    res.json({ message: 'vous n etes pas enseignant' });
    return;
  }

  if (req.body.avancement != '') {
    connection.query(
      "UPDATE tps SET avancement = ? WHERE id = ?",
      [req.body.avancement, req.body.idTps], (err) => {
        if (err) {
          res.json({ message: 'Erreur update avancement ' + err });
          return;
        }
        console.log('Update');
      }
    )
  }

  connection.query(
    "SELECT id,nom,matiere,avancement FROM tps",
    (err, results) => {
      if (err) {
        res.json({ message: 'Erreur select avancement ' + err });
        return;
      }
      if (results.length == 0) {
        res.json({ message: 'Not find ' + err });
        return;
      }
      res.json(results);
    }
  )

})

//Verification token
function verifToken(req, res, next) {
  const token = req.cookies.authtoken;

  if (!token) {
    return res.status(401).json({ message: 'Non connecté' });
  }

  //test si le token est valide
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('authtoken');
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }

}

app.post('/createTp', verifToken, (req, res) => {
  connection.query(
    "INSERT INTO tps(nom,matiere,enseignant,avancement) VALUES(?,?,'LANGLACE Julien','pasafaire') ",
    [req.body.nom, req.body.matiere],
    (err, results) => {
      if (err) {
        res.json({ message: 'Erreur select avancement ' + err });
        return;
      }
      if (results.length == 0) {
        res.json({ message: 'Not find ' + err });
        return;
      }
      res.json(results);
    }
  )
})