// ROUTES ---------------------------------------------------------------------------------------------------------------------------------------------------------

// ROUTE INSCRIPTION ========================================================
// envoie du nom/prenom/email/password/classe en POST sur /inscription
// attention : La classe est obligatoire 

btnInscription.addEventListener('click', () => {

    // Si les champs d'inscription sont cachés on les affiche d'abord
    if (signupField.style.display != 'block') {
        signupField.style.display = 'block';
        btnInscription.classList.remove('btnInscription');
        btnInscription.classList.add('btn-primary');
        connexion.style.display = 'none';
        btnRetour.style.display = 'block';
        return; // On arrête ici pour que l'utilisateur remplisse les champs
    }

    // Vérification simple côté client
    if (classe.value === '') {
        alert('La classe est obligatoire !');
        return;
    }

    fetch('/inscription', {
        credentials: 'include',
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
            if (data.erreur) {
                alert(data.erreur.sqlMessage); // Ex: "Mot de passe invalide" ou "Inscription reussie !"
            } else {
                alert(data.message);
            }
            console.log(data);
        });
});

//Retour
btnRetour.addEventListener('click', () => {
    signupField.style.display = 'none';
    btnInscription.classList.add('btnInscription');
    btnInscription.classList.remove('btn-primary');
    connexion.style.display = 'block';
    btnRetour.style.display = 'none';
})

// ROUTE CONNEXION ====================================================================
// envoie email/password en POST sur /connexion
// le serveur renvoie l'id de l'utilisateur

connexion.addEventListener('click', () => {
    fetch('/connexion', {
        credentials: 'include',
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
            if (data.message == 'connexion echoué') { // Connexion échouée
                alert(data.message);
                console.log(data.message);
            } else { // Connexion réussie, on sauvegarde la classe dans le localStorage
                //console.log('Connexion réussie, classe : ' + data.classe);
                btnAvancement.style.display = 'flex';
                btnTicket.style.display = 'flex';
                btnTp.style.display = 'flex';
                //Remplissage du local storage
                localStorage.setItem('idUsers', data.idUsers);
                localStorage.setItem('page', 'ticket');
                localStorage.setItem('classe', data.classe);
                graphAvancement();
                affichage();

                loginContainer.style.display = 'none';
                btnConnexionInscription.classList.remove('herder-select');

                btnConnexionInscription.innerHTML = 'Deconnexion';
                btnConnexionInscription.id = 'deconnexion';


                if (data.classe == 'enseignant') {
                    avancement('', '');
                    getMatieres();
                    ticketContainerEnseignant.style.display = 'flex';
                } else {
                    ticketContainer.style.display = 'flex';
                }
                btnTicket.classList.add('herder-select');

                btnOpen.addEventListener('click', () => {
                    navComputer.style.display = 'flex';
                });
            }
        })
})

// ROUTE AFFICHAGE ===================================================================================
// envoie id et status en POST sur /affichage
// Si c'est un prof -> liste des élèves avec leurs TPs
// Si c'est un élève -> liste de tous ses TPs avec status

function affichage() {
    fetch('/affichage', {
        credentials: 'include',
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
                if (localStorage.getItem('classe') == 'ciel1' || localStorage.getItem('classe') == 'ciel2') {
                    remplirMenuTicket();
                    remplirTp(labelsArray);
                    remplirTicket();
                } else if (localStorage.getItem('classe') == 'enseignant') {
                    remplirTicket();
                }
            }
        });
}

function avancement(av, id) {
    fetch('/avancement', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avancement: av, // On peut changer ce status selon le besoin
            idTps: id
        })
    }).then(response => response.json())
        .then(data => {
            //console.log(data);
            localStorage.setItem('avancement', JSON.stringify(data));
            graphAvancement();
            remplirAvancement(labelsArray);
        })
}

// ROUTE SUPPRESSION DE MATIÈRE (enseignant) =====================================================

function remplirMenuDeleteMatiere() {
    if (labelsArray.length === 0) return;

    document.querySelectorAll('.option-matiere-delete').forEach(opt => opt.remove());

    labelsArray.forEach(nom => {
        let option = document.createElement('option');
        option.value = nom;
        option.textContent = nom;
        option.className = 'option-matiere-delete';
        choixMatiereDelete.appendChild(option);
    });
}

btnDeleteMatiere.addEventListener('click', () => {
    const nom = choixMatiereDelete.value;

    if (nom === '') {
        alert('Veuillez choisir une matière à supprimer !');
        return;
    }

    const dataAvancement = JSON.parse(localStorage.getItem('avancement'));
    const tpsLies = dataAvancement ? dataAvancement.filter(item => item.matiere === nom) : [];
    if (tpsLies.length > 0) {
        alert(`Impossible de supprimer "${nom}" : ${tpsLies.length} TP(s) lui sont encore liés.\nSupprimez d'abord tous ses TPs.`);
        return;
    }

    if (!confirm(`Supprimer la matière "${nom}" ? Cette action est irréversible.`)) return;

    fetch('/deleteMatiere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'ok') {
                alert('Matière supprimée avec succès !');
                labelsArray = labelsArray.filter(m => m !== nom);
                document.querySelectorAll(`option[value="${nom}"]`).forEach(opt => opt.remove());
                choixMatiereDelete.value = '';
                avancement('', '');
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(err => console.error('Erreur suppression matière :', err));
});

// ROUTE SUPPRESSION DE TP (enseignant) =====================================================

function remplirMenuDeleteTp() {
    if (labelsArray.length === 0) return;

    document.querySelectorAll('.option-matiere-delete-tp').forEach(opt => opt.remove());

    labelsArray.forEach(nom => {
        let option = document.createElement('option');
        option.value = nom;
        option.textContent = nom;
        option.className = 'option-matiere-delete-tp';
        choixMatiereDeleteTp.appendChild(option);
    });

    choixMatiereDeleteTp.addEventListener('change', () => {
        choixTpDelete.innerHTML = '<option value="">Choisir un TP</option>';
        const dataAvancement = JSON.parse(localStorage.getItem('avancement'));
        if (dataAvancement == null) return;
        dataAvancement.forEach(item => {
            if (item.matiere == choixMatiereDeleteTp.value) {
                let option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nom;
                choixTpDelete.appendChild(option);
            }
        });
    });
}

btnDeleteTp.addEventListener('click', () => {
    const idTp = choixTpDelete.value;

    if (idTp === '') {
        alert('Veuillez choisir un TP à supprimer !');
        return;
    }

    if (!confirm('Supprimer ce TP ? Cette action est irréversible.')) return;

    fetch('/deleteTp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idTp })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'ok') {
                alert('TP supprimé avec succès !');
                choixTpDelete.querySelector(`option[value="${idTp}"]`).remove();
                choixTpDelete.value = '';
                avancement('', '');
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(err => console.error('Erreur suppression TP :', err));
});

// ROUTE CRÉATION DE TP (enseignant) =====================================================

function getMatieres() {
    fetch('/getMatieres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log('Erreur getMatieres : ' + data.message);
                return;
            }
            labelsArray = data.map(item => item.nom);
            remplirMenuMatiereTp();
            remplirMenuDeleteMatiere();
            remplirMenuDeleteTp();
            if (localStorage.getItem('avancement') != null) {
                remplirAvancement(labelsArray);
            }
        })
        .catch(err => console.error('Erreur getMatieres :', err));
}

function remplirMenuMatiereTp() {
    if (labelsArray.length === 0) return;

    const optionsExistantes = document.querySelectorAll('.option-matiere-tp');
    optionsExistantes.forEach(opt => opt.remove());

    labelsArray.forEach(nom => {
        let option = document.createElement('option');
        option.value = nom;
        option.textContent = nom;
        option.className = 'option-matiere-tp';
        choixMatiereTp.appendChild(option);
    });
}

btnCreateTp.addEventListener('click', () => {
    const matiere = choixMatiereTp.value;
    const nom = nomTp.value.trim();

    if (matiere === '' || nom === '') {
        alert('Veuillez choisir une matière et entrer un nom de TP !');
        return;
    }

    fetch('/createTp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom, matiere: matiere })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Erreur : ' + data.message);
            } else {
                alert('TP créé avec succès !');
                nomTp.value = '';
                choixMatiereTp.value = '';
                avancement('', '');
            }
        })
        .catch(err => {
            console.error('Erreur création TP :', err);
        });
});

// ROUTE CRÉATION DE MATIÈRE (enseignant) =====================================================

btnCreateMatiere.addEventListener('click', () => {
    const nom = nomMatiere.value.trim();

    if (nom === '') {
        alert('Veuillez entrer un nom de matière !');
        return;
    }

    fetch('/createMatiere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'ok') {
                alert('Matière créée avec succès !');
                getMatieres();
                nomMatiere.value = '';
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(err => {
            console.error('Erreur création matière :', err);
        });
});

// ROUTE CRÉATION DE TICKET =============================================================
// Bouton "Create" dans la page Ticket



btnCreateTicket.addEventListener('click', () => {
    const matiere = document.getElementById('choix-matiere').value;
    const tp = document.getElementById('choix-tp');
    console.log("Tp choisie : " + tp.value);

    if (matiere == '' || tp == '') {
        alert('Veuillez choisir une matière et un TP !');
        return;
    }

    modifierTicket(tp.value, 'encoursdevalidation', localStorage.getItem('idUsers'));

});

// ROUTE MODIFICATION DE TICKET ==========================================================
// envoie status, idUsers et idTps en POST sur /modifierStatus
// Le serveur renvoie le nouveau status et l'idTps pour mettre à jour le localStorage

function modifierTicket(tp, nouveauStatus, userId) {
    fetch('/modifierStatus', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: nouveauStatus,
            idUsers: userId,
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
                dataLocal = JSON.parse(localStorage.getItem('data'));
                dataLocal.forEach(tp => {
                    if (tp.idTps == data.idTps) {
                        tp.status = data.status;
                    }
                });
                localStorage.setItem('data', JSON.stringify(dataLocal));
                remplirTicket();
                remplirTp(labelsArray);
            }
        });

}