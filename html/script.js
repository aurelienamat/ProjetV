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
function avancement() {

    //Recupération avancement info
    console.log('hello');
    fetch('/avancement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idUsers: localStorage.getItem('idUsers') })
    }).then(response => response.json())
        .then(data => {
            console.log(data);
            const labelsArray = [data.length];
            const dataArray = [data.length];
            let i = 0;
            data.forEach(data => {
                labelsArray[i] = data.matiere;
                dataArray[i] = data.nbValide / data.nbTp;
                i++;
            })
            console.log(labelsArray);
            console.log(dataArray);
            //CANVAS
            const barCanvas = document.getElementById('convasAvancement');
            const barChart = new Chart(barCanvas, {
                type: "bar",
                data: {
                    labels: labelsArray,
                    datasets: [{
                        data: dataArray
                    }]
                },
                options: {

                }
            })
        })
}



window.onload = () => {
    console.log('Samlut');
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'flex';
    localStorage.setItem('idUsers', 2);
    avancement();
}

window.addEventListener('resize', () => {
    if (window.innerWidth < 900) {
        navComputer.style.display = 'none';
    }else{
        navComputer.style.display = 'flex';
    }
})