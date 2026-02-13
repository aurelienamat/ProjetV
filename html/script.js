const btnConnexion = document.getElementById('btnConnexion');
const loginContainer = document.querySelector('.loginContainer');
const btnFemer = document.querySelector('.fermer');

btnConnexion.addEventListener('click', function() {
    loginContainer.style.display = 'block';
    btnConnexion.style.display = 'none';
});

btnFermer.addEventListener('click', function() {
    loginContainer.style.display = 'none';
    btnConnexion.style.display = 'block';
})