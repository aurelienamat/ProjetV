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
