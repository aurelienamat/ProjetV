
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
                localStorage.setItem('classe', data.classe);   // On appelle ensuite la route affichage pour récupérer les données
                affichage();
            }
        });
});

// ROUTE CRÉATION DE TICKET =============================================================
// Bouton "Create" dans la page Ticket



btnCreateTicket.addEventListener('click', () => {
    const matiere = document.getElementById('choix-matiere').value;
    const tp = document.getElementById('choix-tp').value;

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
            status: 'nonvalide',
            idUsers: localStorage.getItem('idUsers'),
            idTps: tp // L'id du TP sélectionné
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

// pages -------------------------------------------------------------------------------------------

// Page Connexion
btnConnexionInscription.addEventListener('click', () => {
    localStorage.setItem('page', 'login');
    if (loginContainer.style.display == 'block') {
        location.reload();
    } else {
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        loginContainer.style.display = 'block';
        btnConnexionInscription.classList.add('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        }
    }
});

// Page Ticket
btnTicket.addEventListener('click', () => {
    localStorage.setItem('page', 'ticket');
    if (ticketContainer.style.display == 'flex') {
        location.reload();
    } else {
        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');

        ticketContainer.style.display = 'flex';
        btnTicket.classList.add('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        }
    }
});

// Page TP
btnTp.addEventListener('click', () => {
    localStorage.setItem('page', 'tp');
    if (tpcontainer.style.display == 'flex') {
        location.reload();
    } else {
        tpcontainer.style.display = 'flex';
        btnTp.classList.add('herder-select');

        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');

        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        }
    }
});

// Page Avancement
btnAvancement.addEventListener('click', () => {
    localStorage.setItem('page', 'avancement');
    if (avcontaineur.style.display == 'flex') {
        location.reload();
    } else {
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'flex';
        btnAvancement.classList.add('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        }
    }
});


// NAVIGATION PHONE - Ouvrir/Fermer le menu

btnClose.addEventListener('click', () => {
    navComputer.style.display = 'none';
});

btnOpen.addEventListener('click', () => {
    navComputer.style.display = 'flex';
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 900) {
        navComputer.style.display = 'none';
    } else {
        navComputer.style.display = 'flex';
    }
});


window.onload = () => {
    console.log('Samlut');
    if (localStorage.getItem('data') != null) {
        console.log(JSON.parse(localStorage.getItem('data')));
        const datadata = JSON.parse(localStorage.getItem('data'));
        datadata.forEach(item => {
            if (item.matiere == 'C' && item.status == 'valide') {
                console.log(item.tp);
            }
        })
        avancement();
    }
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none';
    localStorage.setItem('idUsers', 2);
    switch (localStorage.getItem('page')) {
        case "avancement":
            avcontaineur.style.display = 'flex';
            btnAvancement.classList.add('herder-select');
            break;
        case "tp":
            tpcontainer.style.display = 'flex';
            btnTp.classList.add('herder-select');
            break;
        case "ticket":
            ticketContainer.style.display = 'flex';
            btnTicket.classList.add('herder-select');
            break;
        case "login":
            loginContainer.style.display = 'block';
            break;
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth < 900) {
        navComputer.style.display = 'none';
    } else {
        navComputer.style.display = 'flex';
    }
})

// CHARGEMENT DE LA PAGE

// window.onload = () => { // On cache toutes les pages au départ
//     loginContainer.style.display = 'none';
//     ticketContainer.style.display = 'none';
//     tpcontainer.style.display = 'none';
//     avcontaineur.style.display = 'none'; // Par défaut on affiche la page de connexion si pas de page sauvegardée
//     const pageSauvegardee = localStorage.getItem('page');

//     if (!pageSauvegardee) {
//         loginContainer.style.display = 'block';
//         return;
//     }

//     avancement(); // On charge le graphique en arrière plan
//     switch (pageSauvegardee) {
//         case "avancement":
//             avcontaineur.style.display = 'flex';
//             btnAvancement.classList.add('herder-select');
//             break;
//         case "tp":
//             tpcontainer.style.display = 'flex';
//             btnTp.classList.add('herder-select');
//             break;
//         case "ticket":
//             ticketContainer.style.display = 'flex';
//             btnTicket.classList.add('herder-select');
//             break;
//         case "login":
//         default:
//             loginContainer.style.display = 'block';
//             break;
//     }
// };


// GESTION DES BOUTONS NAVIGATION ACTIVE

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
