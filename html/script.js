// pages -------------------------------------------------------------------------------------------

// Page Connexion
btnConnexionInscription.addEventListener('click', () => {
    localStorage.setItem('page', 'login');
    if (loginContainer.style.display == 'block') {
        location.reload();
    } else {
        ticketContainerEnseignant.style.display = 'none';
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        loginContainer.style.display = 'block';
        btnConnexionInscription.classList.add('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

    }
});

// Page Ticket
btnTicket.addEventListener('click', () => {
    remplirMenuTicket();
    remplirTicket();
    localStorage.setItem('page', 'ticket');
    if (ticketContainer.style.display == 'flex' || ticketContainerEnseignant.style.display == 'flex') {
        location.reload();
    } else {
        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');


        if (localStorage.getItem('classe') == 'enseignant') {
            ticketContainerEnseignant.style.display = 'flex';
        } else {
            ticketContainer.style.display = 'flex';
        }
        btnTicket.classList.add('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');
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

        ticketContainerEnseignant.style.display = 'none';
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

    }
});

// Page Avancement
btnAvancement.addEventListener('click', () => {
    localStorage.setItem('page', 'avancement');
    if (avcontaineur.style.display == 'flex') {
        location.reload();
    } else {
        ticketContainerEnseignant.style.display = 'none';
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');

        tpcontainer.style.display = 'none';
        btnTp.classList.remove('herder-select');

        if (localStorage.getItem('classe') == 'enseignant') {

        } else {
            avcontaineur.style.display = 'flex';
        }
        btnAvancement.classList.add('herder-select');

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

    //Mettre toutes les pages none
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none';

    ticketContainerEnseignant.style.display = 'none';

    //Choisir la bonne page
    if (localStorage.getItem('page') != null && localStorage.getItem('idUsers') != null) {
        affichage();
        avancement();
        switch (localStorage.getItem('page')) {
            case "avancement":
                if (localStorage.getItem('classe') == 'enseignant') {

                } else {
                    avcontaineur.style.display = 'flex';
                }
                btnAvancement.classList.add('herder-select');
                break;
            case "tp":
                tpcontainer.style.display = 'flex';
                btnTp.classList.add('herder-select');
                break;
            case "ticket":
                if (localStorage.getItem('classe') == 'enseignant') {
                    ticketContainerEnseignant.style.display = 'flex';
                } else {
                    ticketContainer.style.display = 'flex';
                }
                btnTicket.classList.add('herder-select');
                remplirMenuTicket();
                remplirTicket();
                break;
            case "login":
                loginContainer.style.display = 'block';
                btnConnexionInscription.classList.add('herder-select');
                break;
        }
    } else {
        localStorage.setItem('page', 'login');
        loginContainer.style.display = 'block';
        btnConnexionInscription.classList.add('herder-select');
    }

}


// bouton deroulant choix matiere/tp---------------------------------------------------------------

function remplirMenuTicket() {
    dataLocal = JSON.parse(localStorage.getItem('data'));
    if (dataLocal == null) {
        console.log('Pas de données dans le localStorage');
        return;
    }

    const optionMatiere = document.querySelectorAll(".option-matiere");
    if (optionMatiere != null) {
        //console.log('Pas nul');
        optionMatiere.forEach(optionM => {
            optionM.remove();
        })
    }
    // Vider les selects avant de les remplir
    // choix_matiere.innerHTML = '<option value="">Choisir une matiere</option>';
    // choix_tp.innerHTML = '<option value="">Choisir un TP</option>';

    // Remplir les matieres (sans doublon)
    let matieresDejaAjoutees = [];

    dataLocal.forEach(item => {
        if (!matieresDejaAjoutees.includes(item.matiere)) {
            matieresDejaAjoutees.push(item.matiere);

            let option = document.createElement('option');
            option.value = item.matiere;
            option.textContent = item.matiere;
            option.className = 'option-matiere';
            choix_matiere.appendChild(option);
        }
    });

    // Remplir les TPs selon la matiere choisie
    choix_matiere.addEventListener('change', () => {
        choix_tp.innerHTML = '<option value="">Choisir un TP</option>';
        //console.log(" data : ", dataLocal);
        dataLocal.forEach(item => {
            if (item.matiere == choix_matiere.value && item.status != 'encoursdevalidation' && item.status != 'valide') {
                let option = document.createElement('option');
                option.value = item.idTps; // l'id du TP pour l'envoyer au serveur
                option.textContent = item.tp;
                choix_tp.appendChild(option);
            }
        });
    });
}

function remplirTicket() {
    console.log("Remplit");
    const ticket = document.querySelectorAll('.ticket');
    if (ticket != null) {
        //console.log('Pas nul');
        ticket.forEach(ticketli => {
            ticketli.remove();
        })
    }
    dataLocal = JSON.parse(localStorage.getItem('data'));
    const containerList = document.getElementById('container-list');
    const containerListEnseignant = document.getElementById('container-list-enseignant');
    if (dataLocal == null) {
        console.log('Pas de données dans le localStorage');
        return;
    } else {

        dataLocal.forEach(item => {
            if (item.status == 'encoursdevalidation') {
                //Création des éléements de base
                let li = document.createElement('li');
                li.className = 'ticket';
                containerList.appendChild(li);

                let ul = document.createElement('ul');
                ul.className = 'list-Ticket';
                li.appendChild(ul);

                let limatiere = document.createElement('li');
                limatiere.textContent = item.matiere;
                ul.appendChild(limatiere);

                let litp = document.createElement('li');
                litp.textContent = item.tp;
                ul.appendChild(litp);

                let liprofesseur = document.createElement('li');
                liprofesseur.textContent = item.enseignant;
                ul.appendChild(liprofesseur);

                let validation = document.createElement('li');
                validation.className = 'validation';
                ul.appendChild(validation);

                let listX = document.createElement('li');
                listX.textContent = 'X';
                listX.className = 'ciao';
                listX.style.color = 'red';
                listX.id = "nonvalide" + item.idTps;
                validation.appendChild(listX);
                document.getElementById(listX.id).addEventListener('click', () => {
                    console.log("Non Valide ");
                    modifierTicket(item.idTps, 'nonvalide', localStorage.getItem('idUsers'));
                })
                let listV = document.createElement('li');
                listV.textContent = 'V';
                listV.className = 'ciao';
                listV.style.color = 'green';
                listV.id = "valide" + item.idTps;
                validation.appendChild(listV);
                document.getElementById(listV.id).addEventListener('click', () => {
                    console.log("valide ");
                    modifierTicket(item.idTps, 'valide', localStorage.getItem('idUsers'));
                })

            } else if (localStorage.getItem('classe') == 'enseignant') {
                //Création des éléements de base
                let li = document.createElement('li');
                li.className = 'ticket';
                containerListEnseignant.appendChild(li);

                let ul = document.createElement('ul');
                ul.className = 'list-Ticket';
                li.appendChild(ul);

                let limatiere = document.createElement('li');
                limatiere.textContent = item.matiere;
                ul.appendChild(limatiere);

                let litp = document.createElement('li');
                litp.textContent = item.tp;
                ul.appendChild(litp);

                let liNom = document.createElement('li');
                liNom.textContent = item.nom;
                ul.appendChild(liNom);

                let liClasse = document.createElement('li');
                liClasse.textContent = item.classe;
                ul.appendChild(liClasse);

                let validation = document.createElement('li');
                validation.className = 'validation';
                ul.appendChild(validation);

                let listX = document.createElement('li');
                listX.textContent = 'X';
                listX.className = 'ciao';
                listX.style.color = 'red';
                listX.id = "valide" + item.idTps;
                validation.appendChild(listX);
                document.getElementById(listX.id).addEventListener('click', () => {
                    console.log('Modification X');
                    modifierTicket(item.idTps, 'valide', item.idUsers);
                })
                let listV = document.createElement('li');
                listV.textContent = 'V';
                listV.className = 'ciao';
                listV.style.color = 'green';
                listV.id = "nonvalide" + item.idTps;
                validation.appendChild(listV);
                document.getElementById(listV.id).addEventListener('click', () => {
                    console.log('Modification V');
                    modifierTicket(item.idTps, 'nonvalide', item.idUsers);
                })
            }
        })

    }
}