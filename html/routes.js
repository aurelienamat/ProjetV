// ROUTES ---------------------------------------------------------------------------------------------------------------------------------------------------------

// ROUTE INSCRIPTION ========================================================
// envoie du nom/prenom/email/password/classe en POST sur /inscription
// attention : La classe est obligatoire 

btnInscription.addEventListener('click', () => {

    // Si les champs d'inscription sont cachés on les affiche d'abord
    if (signupField.style.display !== 'block') {
        signupField.style.display = 'block';
        return; // On arrête ici pour que l'utilisateur remplisse les champs
    }

    // Vérification simple côté client
    if (classe.value === '') {
        alert('La classe est obligatoire !');
        return;
    }

    fetch('/inscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            password: password.value,
            classe: classe.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Ex: "Mot de passe invalide" ou "Inscription reussie !"
            }
            console.log(data);
        });
});

// ROUTE CONNEXION ====================================================================
// envoie email/password en POST sur /connexion
// le serveur renvoie l'id de l'utilisateur

connexion.addEventListener('click', () => {
    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) { // Connexion échouée
                alert(data.message);
                console.log(data.message);
            } else { // Connexion réussie, on sauvegarde la classe dans le localStorage
                console.log('Connexion réussie, classe : ' + data.classe);
                localStorage.setItem('idUsers', data.idUsers);   // On appelle ensuite la route affichage pour récupérer les données
                affichage(); //Appel de la fonction pour afficher les données dans dans l'avancement
                localStorage.setItem('page', 'avancement'); //Choix sur quelle page on arrive
                location.reload();
                localStorage.setItem('classe', data.classe);
            }
        });
});

// ROUTE AFFICHAGE ===================================================================================
// envoie id et status en POST sur /affichage
// Si c'est un prof -> liste des élèves avec leurs TPs
// Si c'est un élève -> liste de tous ses TPs avec status

function affichage() {
    fetch('/affichage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'encoursdevalidation', // On peut changer ce status selon le besoin
            id: localStorage.getItem('idUsers')
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log('Erreur affichage : ' + data.message);
        } else {
            // On sauvegarde les données dans le localStorage pour les réutiliser
            localStorage.setItem('data', JSON.stringify(data));
            console.log('Données affichage récupérées : ', data);

            // On affiche la page avancement par défaut après connexion
            avcontaineur.style.display = 'flex';
            btnAvancement.classList.add('herder-select');
            loginContainer.style.display = 'none';

            avancement(); // On lance le graphique
        }
    });
}


// ROUTE CRÉATION DE TICKET =============================================================
// Bouton "Create" dans la page Ticket



btnCreateTicket.addEventListener('click', () => {
    const matiere = document.getElementById('choix-matiere').value;
    const tp = document.getElementById('choix-tp');
    console.log("Tp choisie : " + tp.value);

    if (matiere === '' || tp === '') {
        alert('Veuillez choisir une matière et un TP !');
        return;
    }

    fetch('/modifierStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'encoursdevalidation',
            idUsers: localStorage.getItem('idUsers'),
            idTps: tp.value // L'id du TP sélectionné
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log('Erreur création ticket : ' + data.message);
            } else {
                console.log('Ticket créé avec succès : ', data);

                // Mise à jour du localStorage après confirmation du serveur
                let dataLocal = JSON.parse(localStorage.getItem('data'));
                dataLocal.forEach(tp => {
                    if (tp.idTps == data.idTps) {
                        tp.status = data.status;
                    }
                });
                localStorage.setItem('data', JSON.stringify(dataLocal));
            }
        });
});

// ROUTE MODIFICATION DE TICKET ==========================================================
// envoie status, idUsers et idTps en POST sur /modifierStatus
// Le serveur renvoie le nouveau status et l'idTps pour mettre à jour le localStorage

function modifierTicket(idTps, nouveauStatus) {
    fetch('/modifierStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: nouveauStatus,
            idUsers: localStorage.getItem('idUsers'),
            idTps: idTps
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log('Erreur modification : ' + data.message);
            } else {
                console.log('Modification réussie : ', data);

                // On met à jour le localStorage avec le nouveau status
                // On ne fait la modif que quand le retour du back est reçu (comme demandé)
                let dataLocal = JSON.parse(localStorage.getItem('data'));

                dataLocal.forEach(tp => {
                    if (tp.idTps == data.idTps) {
                        tp.status = data.status; // On met à jour le status
                    }
                });

                localStorage.setItem('data', JSON.stringify(dataLocal));
                console.log('LocalStorage mis à jour');
            }
        });
}
