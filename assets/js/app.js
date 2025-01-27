// Variables iniciales de estado del juego
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Referencias a elementos HTML
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Definición de armas y monstruos
const weapons = [
    { name: "stick", power: 5 },
    { name: "dagger", power: 30 },
    { name: "claw hammer", power: 50 },
    { name: "sword", power: 100 },
];
const monsters = [
    { name: "slime", level: 2, health: 15 },
    { name: "fanged beast", level: 8, health: 60 },
    { name: "dragon", level: 20, health: 300 },
];

// Ubicaciones y sus configuraciones
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: 'You are in the town square. You see a sign that says "Store".',
    },
    {
        name: "store",
        "button text": [
            "Buy 10 health (10 gold)",
            "Buy weapon (30 gold)",
            "Go to town square",
        ],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store.",
    },
    {
        name: "cave",
        "button text": [
            "Fight slime",
            "Fight fanged beast",
            "Go to town square",
        ],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters.",
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster.",
    },
    {
        name: "kill monster",
        "button text": [
            "Go to town square",
            "Go to town square",
            "Go to town square",
        ],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;",
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
    },
];

// Configura los botones iniciales
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Actualiza la interfaz según la ubicación
function update(location) {
    monsterStats.style.display = "none"; // Oculta estadísticas del monstruo
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

// Funciones de navegación
function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

// Compra de salud
function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "No tienes suficiente oro para comprar salud.";
    }
}

// Compra de armas
function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "Ahora tienes un " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " En tu inventario tienes: " + inventory;
        } else {
            text.innerText = "No tienes suficiente oro para comprar un arma.";
        }
    } else {
        text.innerText = "¡Ya tienes el arma más poderosa!";
        button2.innerText = "Vender arma por 15 oro";
        button2.onclick = sellWeapon;
    }
}

// Vender armas
function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "Vendiste un " + currentWeapon + ".";
        text.innerText += " En tu inventario tienes: " + inventory;
    } else {
        text.innerText = "¡No vendas tu única arma!";
    }
}

// Inicia una pelea con un monstruo
function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

// Configuración para pelear
function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

// Realiza un ataque al monstruo
function attack() {
    text.innerText = "El " + monsters[fighting].name + " ataca.";
    text.innerText +=
        " Tú lo atacas con tu " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -=
            weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " Fallaste.";
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    // Condiciones de victoria o derrota
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }
    if (Math.random() <= 0.1 && inventory.length !== 1) {
        text.innerText += " Tu " + inventory.pop() + " se rompe.";
        currentWeapon--;
    }
}

// Calcula el daño del monstruo
function getMonsterAttackValue(level) {
    const hit = level * 5 - Math.floor(Math.random() * xp);
    return hit > 0 ? hit : 0;
}

// Verifica si el ataque impacta
function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

// Esquivar el ataque
function dodge() {
    text.innerText = "Esquivaste el ataque del " + monsters[fighting].name;
}

// Derrota a un monstruo
function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

// Condición de derrota
function lose() {
    update(locations[5]);
}

// Condición de victoria
function winGame() {
    update(locations[6]);
}

// Reinicia el juego
function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}

// Juego secreto
function easterEgg() {
    update(locations[7]);
}

// Selección en el juego secreto
function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "Elegiste " + guess + ". Aquí están los números aleatorios:\n";
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.includes(guess)) {
        text.innerText += "¡Correcto! Ganas 20 oro.";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "¡Incorrecto! Pierdes 10 salud.";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}
