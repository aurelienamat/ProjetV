
// Containers des pages
const loginContainer = document.querySelector('.loginContainer');
const ticketContainer = document.getElementById('container-Ticket');
const tpcontainer = document.getElementById('container-tp');
const avcontaineur = document.getElementById('containeur-avancement-graph');

const ticketContainerEnseignant = document.getElementById('container-Ticket-enseignant');
const avContaineurEnseignant = document.getElementById('container-avancement');

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


const btnClose = document.getElementById('close-phone');
const btnOpen = document.getElementById('open-phone');
const navComputer = document.getElementById('nav-computer');

const btnCreateTicket = document.getElementById('submit-btn-create-ticket');

const navButtons = document.querySelectorAll('#navigation li');

const choix_matiere = document.getElementById('choix-matiere');
const choix_tp = document.getElementById('choix-tp');

var dataLocal = JSON.parse(localStorage.getItem('data'));

var labelsArray = [];
