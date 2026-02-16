const loginContainer = document.querySelector('.loginContainer');

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

window.onload = () => {
    console.log('Samlut');
    loginContainer.style.display = 'block';
}

//Afficahge de la page de connexion
const btnConnexionInscription = document.getElementById('connexion-inscription');
btnConnexionInscription.addEventListener('click', () => {
    if (loginContainer.style.display == 'block') {
        loginContainer.style.display = 'none';
        btnConnexionInscription.classList.remove('herder-select');
    } else {
        loginContainer.style.display = 'block';
        btnConnexionInscription.classList.add('herder-select');
    }
})