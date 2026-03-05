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

        remplirMenuTicket();
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
        const datadata = JSON.parse(localStorage.getItem('data'));
    }

    avancement();
    loginContainer.style.display = 'none';
    ticketContainer.style.display = 'none';
    tpcontainer.style.display = 'none';
    avcontaineur.style.display = 'none';

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
<<<<<<< HEAD
            remplirMenuTicket(); // <-- AJOUT ICI aussi pour le reload
            remplirTicket();
            break;
=======
            remplirMenuTicket(); // <-- AJOUT ICI aussi pour le reload            break;
>>>>>>> a84c69d (affichage ticket1)
        case "login":
            loginContainer.style.display = 'block';
            btnConnexionInscription.classList.add('herder-select');
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


// bouton deroulant choix matiere/tp---------------------------------------------------------------

function remplirMenuTicket() {
    let dataLocal = JSON.parse(localStorage.getItem('data'));

    if (dataLocal == null) {
        console.log('Pas de données dans le localStorage');
        return;
    }

    // Vider les selects avant de les remplir
    choix_matiere.innerHTML = '<option value="">Choisir une matiere</option>';
    choix_tp.innerHTML = '<option value="">Choisir un TP</option>';

    // Remplir les matieres (sans doublon)
    let matieresDejaAjoutees = [];

    dataLocal.forEach(item => {
        if (!matieresDejaAjoutees.includes(item.matiere)) {
            matieresDejaAjoutees.push(item.matiere);

            let option = document.createElement('option');
            option.value = item.matiere;
            option.textContent = item.matiere;
            choix_matiere.appendChild(option);
        }
    });

    // Remplir les TPs selon la matiere choisie
    choix_matiere.addEventListener('change', () => {
        choix_tp.innerHTML = '<option value="">Choisir un TP</option>';
        //console.log(" data : ", dataLocal);
        dataLocal.forEach(item => {
            if (item.matiere == choix_matiere.value) {
                let option = document.createElement('option');
                option.value = item.idTps; // l'id du TP pour l'envoyer au serveur
                option.textContent = item.tp;
                choix_tp.appendChild(option);
            }
        });
    });
}

function remplirTicket() {
    let dataLocal = JSON.parse(localStorage.getItem('data'));
    const containerList = document.getElementById('container-list');
    if (dataLocal == null) {
        console.log('Pas de données dans le localStorage');
        return;
    }else{

        dataLocal.forEach(item => {
            if(item.status == 'encoursdevalidation'){
                console.log("Nouvel element crée " + item.tp);

                let li = document.createElement('li');
                containerList.appendChild(li);


                let ul = document.createElement('ul');
                ul.className = 'list-Ticket';
                li.appendChild(ul);


                let litp = document.createElement('li');
                litp.textContent = item.tp;
                ul.appendChild(litp);

                let limatiere = document.createElement('li');
                limatiere.textContent = item.matiere;
                ul.appendChild(limatiere);
            }
        })
    }



}