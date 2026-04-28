// pages -------------------------------------------------------------------------------------------
// Page Connexion
btnConnexionInscription.addEventListener('click', () => {
    localStorage.setItem('page', 'login');
    //Séparation déconnexion, connexion
    btnDeco = document.getElementById('deconnexion');

    if (btnDeco == null) {
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
            avContaineurEnseignant.style.display = 'none';
            btnAvancement.classList.remove('herder-select');

        }
    } else {
        //envoie vers la route pour se deco
        //JavaScript n'a pas accès au cookie et ne peut pas le supprimer lui même a cause de httpOnly
        fetch('/deconnexion', { method: 'POST' })
            .then(() => {
                deco();
                location.reload();
            })
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
        tpContainerEnseignant.style.display = 'none';
        btnTp.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        avContaineurEnseignant.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        } else {
            navComputer.style.display = 'flex';
        }

    }
});

// Page TP
btnTp.addEventListener('click', () => {
    localStorage.setItem('page', 'tp');
    if (tpcontainer.style.display == 'flex' || tpContainerEnseignant.style.display == 'flex') {
        location.reload();
    } else {
        if (localStorage.getItem('classe') === 'enseignant') {
            getMatieres();
            tpContainerEnseignant.style.display = 'flex';
        } else {
            tpcontainer.style.display = 'flex';
        }
        btnTp.classList.add('herder-select');

        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');

        ticketContainerEnseignant.style.display = 'none';
        ticketContainer.style.display = 'none';
        btnTicket.classList.remove('herder-select');

        avcontaineur.style.display = 'none';
        avContaineurEnseignant.style.display = 'none';
        btnAvancement.classList.remove('herder-select');

        if (window.innerWidth < 900) {
            navComputer.style.display = 'none';
        } else {
            navComputer.style.display = 'flex';
        }
    }
});

// Page Avancement
btnAvancement.addEventListener('click', () => {
    localStorage.setItem('page', 'avancement');

    if (localStorage.getItem('classe') == 'enseignant') {
        avContaineurEnseignant.style.display = 'flex';
    } else {
        avcontaineur.style.display = 'flex';
        location.reload();
    }

    ticketContainerEnseignant.style.display = 'none';
    ticketContainer.style.display = 'none';
    btnTicket.classList.remove('herder-select');

    loginContainer.style.display = 'none';
    btnConnexionInscription.classList.remove('herder-select');

    tpcontainer.style.display = 'none';
    tpContainerEnseignant.style.display = 'none';
    btnTp.classList.remove('herder-select');

    btnAvancement.classList.add('herder-select');

    if (window.innerWidth < 900) {
        navComputer.style.display = 'none';
    } else {
        navComputer.style.display = 'flex';
    }

});


// NAVIGATION PHONE - Ouvrir/Fermer le menu

btnClose.addEventListener('click', () => {
    navComputer.style.display = 'none';
});

// btnOpen.addEventListener('click', () => {
//     navComputer.style.display = 'flex';
// });

window.addEventListener('resize', () => {
    if (window.innerWidth < 900) {
        navComputer.style.display = 'none';
    } else {
        navComputer.style.display = 'flex';
    }
});


window.addEventListener('DOMContentLoaded', () => {

    // Masquer toutes les pages immédiatement
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    tpContainerEnseignant.style.display = 'none';
    avcontaineur.style.display = 'none';
    ticketContainerEnseignant.style.display = 'none';
    avContaineurEnseignant.style.display = 'none';

    // Vérification connexion → tout l'affichage dépend de cette réponse
    fetch('/isConnect', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur serveur : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Connecté') {
                // Rafraîchir la classe depuis le serveur (plus fiable que le localStorage seul)
                localStorage.setItem('classe', data.classe);

                btnOpen.addEventListener('click', () => {
                    navComputer.style.display = 'flex';
                });
                btnAvancement.style.display = 'flex';
                btnTicket.style.display = 'flex';
                btnTp.style.display = 'flex';
                btnConnexionInscription.innerHTML = 'Deconnexion';
                btnConnexionInscription.id = 'deconnexion';

                if (data.classe === 'enseignant') {
                    affichage();
                    avancement('', '');
                } else if (data.classe === 'ciel1' || data.classe === 'ciel2') {
                    affichage();
                    graphAvancement();
                }

                // Afficher la bonne page maintenant qu'on sait que l'utilisateur est connecté
                afficherBonnePage();

            } else {
                afficherPageLogin();
            }
        })
        .catch(erreur => {
            console.error('Impossible de vérifier la connexion :', erreur);
            afficherPageLogin();
        });

});

function afficherBonnePage() {
    const page = localStorage.getItem('page');

    if (page === null) {
        afficherPageLogin();
        return;
    }

    switch (page) {
        case 'avancement':
            if (localStorage.getItem('classe') === 'enseignant') {
                avContaineurEnseignant.style.display = 'flex';
            } else {
                avcontaineur.style.display = 'flex';
            }
            btnAvancement.classList.add('herder-select');
            break;
        case 'tp':
            if (localStorage.getItem('classe') === 'enseignant') {
                getMatieres();
                tpContainerEnseignant.style.display = 'flex';
            } else {
                tpcontainer.style.display = 'flex';
            }
            btnTp.classList.add('herder-select');
            break;
        case 'ticket':
            if (localStorage.getItem('classe') === 'enseignant') {
                ticketContainerEnseignant.style.display = 'flex';
            } else {
                ticketContainer.style.display = 'flex';
            }
            btnTicket.classList.add('herder-select');
            remplirMenuTicket();
            remplirTicket();
            break;
        case 'login':
        default:
            afficherPageLogin();
            break;
    }
}

function afficherPageLogin() {
    localStorage.clear();
    localStorage.setItem('page', 'login');
    loginContainer.style.display = 'block';
    btnConnexionInscription.classList.add('herder-select');
    btnAvancement.style.display = 'none';
    btnTicket.style.display = 'none';
    btnTp.style.display = 'none';
}


// bouton deroulant choix matiere/tp---------------------------------------------------------------

function remplirMenuTicket() { //remplir option coté eleve
    console.log("Remplir menu ticket");
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

function remplirTicket() { //Remplir ticket coté prof ET eleve
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
            if (item.status == 'encoursdevalidation' && (localStorage.getItem('classe') == 'ciel1' || localStorage.getItem('classe') == 'ciel2')) {
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
                    dataLocal.status = 'nonvalide';
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
                    dataLocal.status = 'valide';
                })

            } else if (localStorage.getItem('classe') == 'enseignant' && item.status == 'encoursdevalidation') {
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
                listX.textContent = 'V';
                listX.className = 'ciao';
                listX.style.color = 'green';
                listX.id = "valide" + item.idTps;
                validation.appendChild(listX);
                document.getElementById(listX.id).addEventListener('click', () => {
                    console.log('Modification V');
                    modifierTicket(item.idTps, 'valide', item.idUsers);
                    dataLocal.status = 'valide';
                })
                let listV = document.createElement('li');
                listV.textContent = 'X';
                listV.className = 'ciao';
                listV.style.color = 'red';
                listV.id = "nonvalide" + item.idTps;
                validation.appendChild(listV);
                document.getElementById(listV.id).addEventListener('click', () => {
                    console.log('Modification X');
                    modifierTicket(item.idTps, 'nonvalide', item.idUsers);
                    dataLocal.status = 'nonvalide';
                })
            }
        })
        localStorage.setItem('data', JSON.stringify(dataLocal));

    }
}

function remplirTp(matieretp) {
    dataLocal = JSON.parse(localStorage.getItem('data'));

    const divTp = document.querySelectorAll('.div-tp');
    if (divTp != null) {
        //console.log('Pas nul');
        divTp.forEach(div => {
            div.remove();
        })
    }

    matieretp.forEach(mat => {
        let divMat = document.createElement('div');
        divMat.className = 'div-tp';
        tpcontainer.appendChild(divMat);

        let h1Mat = document.createElement('h2');
        h1Mat.innerHTML = mat;
        divMat.appendChild(h1Mat);

        let ulMat = document.createElement('ul');
        divMat.appendChild(ulMat);

        dataLocal.forEach(data => {
            if (data.matiere == mat) {
                let liTp = document.createElement('li');
                liTp.innerHTML = data.tp;
                if (data.avancement == 'pasafaire') {
                    liTp.style.backgroundColor = 'lightgrey';
                } else if (data.status == 'valide') {
                    liTp.style.backgroundColor = 'lightgreen';
                } else if (data.status == 'nonvalide') {
                    liTp.style.backgroundColor = '#FF7F7F';
                }
                ulMat.appendChild(liTp);

                let ul = document.createElement('ul');
                liTp.appendChild(ul);

                if (data.status == 'nonvalide') {
                    let listX = document.createElement('input');
                    listX.type = 'button';
                    listX.value = 'V';
                    listX.className = 'ciao';
                    listX.style.color = 'green';
                    listX.id = "tpvalide" + data.idTps + data.matiere;
                    ul.appendChild(listX);
                    document.getElementById(listX.id).addEventListener('click', () => {
                        console.log('Modification V');
                        modifierTicket(data.idTps, 'valide', localStorage.getItem('idUsers'));
                        dataLocal.status = 'valide';
                    })
                } else if (data.status == 'valide') {
                    let listV = document.createElement('input');
                    listV.type = 'button';
                    listV.value = 'X';
                    listV.className = 'ciao';
                    listV.style.color = 'red';
                    listV.id = "tpnonvalide" + data.idTps + data.matiere;
                    ul.appendChild(listV);
                    document.getElementById(listV.id).addEventListener('click', () => {
                        console.log('Modification X');
                        modifierTicket(data.idTps, 'nonvalide', localStorage.getItem('idUsers'));
                        dataLocal.status = 'nonvalide';
                    })
                } else {
                    let listV = document.createElement('input');
                    listV.type = 'button';
                    listV.value = 'X';
                    listV.className = 'ciao';
                    listV.style.color = 'red';
                    listV.id = "tpnonvalide" + data.idTps + data.matiere;
                    ul.appendChild(listV);
                    document.getElementById(listV.id).addEventListener('click', () => {
                        console.log('Modification X');
                        modifierTicket(data.idTps, 'nonvalide', localStorage.getItem('idUsers'));
                        dataLocal.status = 'nonvalide';
                    })
                    let listX = document.createElement('input');
                    listX.type = 'button';
                    listX.value = 'V';
                    listX.className = 'ciao';
                    listX.style.color = 'green';
                    listX.id = "tpvalide" + data.idTps + data.matiere;
                    ul.appendChild(listX);
                    document.getElementById(listX.id).addEventListener('click', () => {
                        console.log('Modification V');
                        modifierTicket(data.idTps, 'valide', localStorage.getItem('idUsers'));
                        dataLocal.status = 'valide';
                    })
                }

            }
        })
        localStorage.setItem('data', JSON.stringify(dataLocal));
    })
}

function remplirAvancement(matieretp) {
    dataLocalAv = JSON.parse(localStorage.getItem('avancement'));

    //console.log(dataLocalAv);

    const divTp = document.querySelectorAll('.div-av');
    if (divTp != null) {
        //console.log('Pas nul');
        divTp.forEach(div => {
            div.remove();
        })
    }

    matieretp.forEach(mat => {
        if (!dataLocalAv.some(data => data.matiere == mat)) return;

        let divMat = document.createElement('div');
        divMat.className = 'div-av';
        avContaineurEnseignant.appendChild(divMat);

        let h1Mat = document.createElement('h2');
        h1Mat.innerHTML = mat;
        divMat.appendChild(h1Mat);

        let ulMat = document.createElement('ul');
        divMat.appendChild(ulMat);

        dataLocalAv.forEach(data => {
            if (data.matiere == mat) {
                let liTp = document.createElement('li');
                liTp.innerHTML = data.nom;
                if (data.avancement == 'pasafaire') {
                    liTp.style.backgroundColor = 'lightgrey';
                } else if (data.avancement == 'afaire') {
                    liTp.style.backgroundColor = 'lightgreen';
                }
                ulMat.appendChild(liTp);

                let ul = document.createElement('ul');
                liTp.appendChild(ul);

                if (data.avancement == 'afaire') {
                    let listV = document.createElement('li');
                    listV.textContent = "Enlever de l'avancement";
                    listV.className = 'av';
                    listV.style.color = 'red';
                    listV.id = "Enlever" + data.id + data.matiere;
                    ul.appendChild(listV);
                    document.getElementById(listV.id).addEventListener('click', () => {
                        console.log('Enlever de l avancement');
                        avancement('pasafaire', data.id);
                        dataLocalAv.forEach(datadata => {
                            if (data.matiere == datadata.matiere) {
                                if (datadata.id > data.id) {
                                    //console.log(datadata.id);
                                    //console.log(datadata.nom);
                                    avancement('pasafaire', datadata.id);
                                }
                            }
                        })
                    })
                } else {
                    let listX = document.createElement('li');
                    listX.textContent = "Ajouter à l'avancement";
                    listX.className = 'av';
                    listX.style.color = 'green';
                    listX.id = "ajouter" + data.id + data.matiere;
                    ul.appendChild(listX);
                    document.getElementById(listX.id).addEventListener('click', () => {
                        console.log('Ajouter à l avancement');
                        avancement('afaire', data.id);
                        dataLocalAv.forEach(datadata => {
                            if (data.matiere == datadata.matiere) {
                                if (datadata.id < data.id) {
                                    //console.log(datadata.id);
                                    //console.log(datadata.nom);
                                    avancement('afaire', datadata.id);
                                }
                            }
                        })
                    })
                }


            }

        }
        )
    })
}

function deco() {
    localStorage.clear();
}