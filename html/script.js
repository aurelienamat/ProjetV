
// Containers des pages
const loginContainer = document.querySelector('.loginContainer');
const ticketContainer = document.getElementById('container-Ticket');
const tpcontainer = document.getElementById('container-tp');
const avcontaineur = document.getElementById('containeur-avancement');

// Boutons de navigation
const btnConnexionInscription = document.getElementById('connexion-inscription');
const btnTicket = document.getElementById('btn-Ticket');
const btnTp = document.getElementById('btn-Tp');
const btnAvancement = document.getElementById('btn-Avancement');

// formulaire connexion/inscription
const email = document.getElementById('email');
const password = document.getElementById('password');
const prenom = document.getElementById('prenom');
const nom = document.getElementById('nom');
const classe = document.getElementById('classe');

// Boutons du formulaire
const connexion = document.getElementById('submit-btn');
const btnInscription = document.getElementById('btnInscription');
const signupField = document.querySelector('.signupField');


// routes ---------------------------------------------------------------------------------------------------------------------------------------------------------

// ROUTE INSCRIPTION ========================================================
// envoie du nom/prenom/email/password/classe en POST sur /inscription
// attention : La classe est obligatoire 

btnInscription.addEventListener('click', () => {

    // Si les champs d'inscription sont cachés, on les affiche d'abord
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
<<<<<<< HEAD
});
=======
})
//affichage des champs d'inscription
const btnInscription = document.getElementById('btnInscription');
const signupField = document.querySelector('.signupField'); //  retourne l'élément directement

btnInscription.addEventListener('click', () => {
    if (signupField.style.display == 'block') {
        signupField.style.display = 'none';
    } else {
        signupField.style.display = 'block';
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


//TEST CANVAS GRAPHIQUE
const barCanvas = document.getElementById('convasAvancement');
function avancement() {
    fetch('/avancement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idUsers: localStorage.getItem('idUsers') })
    }).then(response => response.json())
        .then(data => {
            console.log(data);

            // Préparer les données
            const labelsArray = data.map(item => item.matiere);
            //console.log(labelsArray);
            const pourcentages = data.map(item => (item.nbValide / item.nbTp) * 100);
            //console.log(pourcentages);

            // 3 datasets : Validé / Restant / Bonus
            //Si p est plus grand que 100 alors il est = a 100 sinon il est égale a p
            //Necessaire car l'avancement peut être de 125%
            const dataValide = pourcentages.map(p => p > 100 ? 100 : p);
            //console.log(dataValide);
            //Le reste est de 0 si l'avancement est plus grand que 100
            const dataRestant = pourcentages.map(p => p < 100 ? 100 - p : 0);
            const dataSurplus = pourcentages.map(p => p > 100 ? p - 100 : 0);

            // Couleurs dynamiques pour la partie validée
            const couleursValide = pourcentages.map(p => {
                if (p >= 100) return '#44a049';      // Vert foncé (complet)
                if (p >= 75) return '#42a3f3';       // Palm leaf (bien)
                if (p >= 50) return '#fad636';       // Lime cream (moyen)
                return '#e53936';                     // Rouge (en retard)
            });

            const barCanvas = document.getElementById('convasAvancement');

            // Chart
            const barChart = new Chart(barCanvas, {
                type: "bar",
                data: {
                    labels: labelsArray,
                    datasets: [
                        {
                            label: 'Validés',
                            data: dataValide,
                            backgroundColor: couleursValide,
                            borderColor: '#31572c',
                            borderWidth: 2,
                            //borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: 'Restants',
                            data: dataRestant,
                            backgroundColor: '#d1d5db',     // Gris clair
                            borderColor: '#9ca3af',
                            borderWidth: 2,
                            //borderRadius: 8,
                            borderSkipped: false
                        },
                        {
                            label: 'Bonus',
                            data: dataSurplus,
                            backgroundColor: '#ffd700',      // Doré
                            borderColor: '#ffed4e',
                            borderWidth: 2,
                            //borderRadius: 8,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                        x: {
                            stacked: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                },
                                color: '#132a13'
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            max: Math.max(...pourcentages.map(p => Math.ceil(p / 10) * 10), 120),
                            grid: {
                                color: 'rgba(144, 169, 85, 0.1)',
                                lineWidth: 1
                            },
                            ticks: {
                                callback: value => value + '%',
                                font: {
                                    size: 12
                                },
                                color: '#31572c'
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                borderRadius: 4,
                                font: {
                                    size: 13,
                                    weight: '600'
                                },
                                color: '#132a13',
                                padding: 15
                            }
                        },
                        tooltip: {
                            //Mise en forme du survole
                            enabled: true,
                            backgroundColor: 'rgba(19, 42, 19, 0.9)',
                            titleColor: '#ecf39e',
                            bodyColor: '#fff',
                            borderColor: '#4f772d',
                            borderWidth: 2,
                            cornerRadius: 8,
                            padding: 12,
                            displayColors: true,
                            callbacks: {
                                label: (item) => {

                                    const index = item.dataIndex; //Quelle barre (0, 1, 2...)0 = Linux, 1 = Windows, etc.
                                    const indexName = item.label; //Récupère le nom de la barre ex : Linux, Windows...ect
                                    const nbValide = data[index].nbValide;//Nombre de valide qui sont a faire pour cette barre
                                    const nbTp = data[index].nbTp;//Nombre de tp pour cette barre
                                    const total = pourcentages[index];// % de valide pour cette barre
                                    //Récup data du local storage
                                    let dataLocal = localStorage.getItem('data');
                                    dataLocal = JSON.parse(dataLocal);
                                    //Tableau avec tp par rapport aux status

                                    const tpValide = [];
                                    const tpNonvalide = [];
                                    const tpBonus = [];

                                    dataLocal.forEach(data => {
                                        if (data.matiere == indexName && data.status == 'nonvalide' && data.avancement == 'afaire') {
                                            tpNonvalide.push(data.tp);
                                        }
                                        if (data.matiere == indexName && data.status == 'valide' && data.avancement == 'afaire') {
                                            tpValide.push(data.tp);
                                        }
                                        if (data.matiere == indexName && data.status == 'valide' && data.avancement == 'pasafaire') {
                                            tpBonus.push(data.tp);
                                        }
                                    })

                                    //console.log(dataLocal);
                                    //console.log(tpValide);

                                    //Renvoie de données du survole
                                    //Quel dataset (0, 1, 2...)0 = Validés, 1 = Restants, 2 = Bonus
                                    if (item.datasetIndex === 0) {
                                        //gestion si un tp est valide mais en dehors des tp a validé
                                        //nb de tp valide au total !! même les non a faire
                                        const nbValidePasaFaire = [];
                                        dataLocal.forEach(item => {
                                            if(item.status == 'valide' && item.matiere == indexName){
                                                nbValidePasaFaire.push(item.tp);
                                            }
                                        })
                                        if (nbValidePasaFaire.length > tpValide.length) {
                                            let tpValideHorsAvancement = [];
                                            dataLocal.forEach(data => {
                                                if (data.matiere == indexName && data.status == 'valide' && data.avancement == 'pasafaire') {
                                                    tpValideHorsAvancement.push(data.tp);
                                                }
                                            })
                                            return [
                                                `✅ Validés: ${nbValide}/${nbTp} TPs (${Math.round(item.raw)}%)`,
                                                tpValide,
                                                'Un ou plusieurs tp ont été validé alors qu il n etaient pas à faire',
                                                tpValideHorsAvancement
                                            ]
                                        } else {
                                            return [
                                                `✅ Validés: ${nbValide}/${nbTp} TPs (${Math.round(item.raw)}%)`,
                                                tpValide
                                            ]
                                        }
                                        // Partie VALIDÉE


                                    } else if (item.datasetIndex === 1) {
                                        // Partie RESTANTE
                                        const restants = nbTp - nbValide;
                                        return [
                                            `⏳ Restants: ${restants}/${nbTp} TPs (${Math.round(item.raw)}%)`,
                                            tpNonvalide
                                        ]
                                    } else {
                                        // BONUS
                                        return [
                                            `🌟 Bonus: +${Math.round(item.raw)}% (Total: ${Math.round(total)}%)`,
                                            tpBonus
                                        ]
                                    }
                                }
                            }
                        },
                        annotation: {
                            annotations: {
                                line100: {
                                    type: 'line',
                                    yMin: 100,
                                    yMax: 100,
                                    borderColor: '#132a13',
                                    borderWidth: 3,
                                    borderDash: [10, 5],
                                    label: {
                                        display: true,
                                        content: 'Objectif 100%',
                                        position: 'end',
                                        backgroundColor: '#132a13',
                                        color: '#ecf39e',
                                        font: {
                                            size: 11,
                                            weight: 'bold'
                                        },
                                        padding: 4,
                                        borderRadius: 4
                                    }
                                }
                            }
                        }
                    },

                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        });
}



window.onload = () => {
    console.log('Samlut');
    console.log(JSON.parse(localStorage.getItem('data')));
    const datadata = JSON.parse(localStorage.getItem('data'));
    datadata.forEach(item => {
        if (item.matiere == 'C' && item.status == 'valide') {
            console.log(item.tp);
        }
    })
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none';
    localStorage.setItem('idUsers', 2);
    avancement();
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

window.onload = () => { // On cache toutes les pages au départ
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none'; // Par défaut on affiche la page de connexion si pas de page sauvegardée
    const pageSauvegardee = localStorage.getItem('page');

    if (!pageSauvegardee) {
        loginContainer.style.display = 'block';
        return;
    }

    avancement(); // On charge le graphique en arrière plan
    switch (pageSauvegardee) {
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
        default:
            loginContainer.style.display = 'block';
            break;
    }
};


// GESTION DES BOUTONS NAVIGATION ACTIVE

const navButtons = document.querySelectorAll('#navigation li');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
