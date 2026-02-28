// Container 
const loginContainer = document.querySelector('.loginContainer');
const ticketContainer = document.getElementById('container-Ticket');
const tpcontainer = document.getElementById('container-tp');
const avcontaineur = document.getElementById('containeur-avancement');

const connexion = document.getElementById('submit-btn');

const email = document.getElementById('email');
const password = document.getElementById('password');

connexion.addEventListener('click', () => {
    fetch('/affichage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: password.value, id: email.value })
    }).then(response => response.json())
        .then(data => {
            if (data.message == null) {
                localStorage.setItem("data", JSON.stringify(data));
                let dataLocal = localStorage.getItem('data');
                dataLocal = JSON.parse(dataLocal);
                if (dataLocal[0].nom == null) {
                    dataLocal.forEach(tp => {
                        if (tp.status == 'valide') {
                            console.log(" ", tp.tp + " " + tp.matiere);
                        }
                    })
                }
                console.log(dataLocal);
            } else {
                console.log(data.message);
            }
        });
})



//Afficahge de la page de connexion
const btnConnexionInscription = document.getElementById('connexion-inscription');
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
})

//Affichage de la page Ticket
const btnTicket = document.getElementById('btn-Ticket');
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
})

//Affichage de la page TP
const btnTp = document.getElementById('btn-Tp');
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
})

//Afficahge de l'avancement
const btnAvancement = document.getElementById('btn-Avancement');
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
})

//Afficahge de phone
const btnClose = document.getElementById('close-phone');
const btnOpen = document.getElementById('open-phone');
const navComputer = document.getElementById('nav-computer');

btnClose.addEventListener('click', () => {
    navComputer.style.display = 'none';
})
btnOpen.addEventListener('click', () => {
    navComputer.style.display = 'flex';
})

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
                                    const nbValide = data[index].nbValide;//Nombre de valide pour cette barre
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
                                        if (data.matiere == indexName && data.status == 'valide' && data.avancement == 'afaire') {
                                            tpValide.push(data.tp);
                                        }
                                    })
                                    dataLocal.forEach(data => {
                                        if (data.matiere == indexName && data.status == 'nonvalide' && data.avancement == 'afaire') {
                                            tpNonvalide.push(data.tp);
                                        }
                                    })
                                    dataLocal.forEach(data => {
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
                                        if (nbValide > tpValide.length) {
                                            return [
                                                `✅ Validés: ${nbValide}/${nbTp} TPs (${Math.round(item.raw)}%)`,
                                                tpValide,
                                                'Un ou plusieurs tp ont été validé alors qu il n etaient pas à faire'
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
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none';
    localStorage.setItem('idUsers', 2);
    avancement();
    switch (localStorage.getItem('page')) {
        case "avancement":
            avcontaineur.style.display = 'flex';
            break;
        case "tp":
            tpcontainer.style.display = 'flex';
            break;
        case "ticket":
            ticketContainer.style.display = 'flex';
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