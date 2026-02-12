const btnConnexion = document.getElementById('btnConnexion');
const loginContainer = document.querySelector('.loginContainer');
const btnFemer = document.querySelector('.fermer');

btnConnexion.addEventListener('click', function() {
    loginContainer.style.display = 'block';
});

btnFermer.addEventListener('click', function() {
    loginContainer.style.display = 'none';
})