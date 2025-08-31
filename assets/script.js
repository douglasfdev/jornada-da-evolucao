let progresso = 0;
let prestigio = 0;
let progressPerClick = 1;
let progressPerSecond = 0;

const fases = [
    {
        nome: 'Idade da Pedra',
        progressoNecessario: 10000,
        image: 'https://i.imgur.com/vH1N88k.png',
        upgrades: [
            { id: 'upgrade1', name: 'Ferramenta de Pedra', cost: 10, pps: 0, ppc: 1, owned: 0 },
            { id: 'upgrade2', name: 'Fogo', cost: 50, pps: 2, ppc: 0, owned: 0 }
        ]
    },
    {
        nome: 'Idade do Bronze',
        progressoNecessario: 50000,
        image: 'https://i.imgur.com/mD2sL9I.png',
        upgrades: [
            { id: 'upgrade3', name: 'Agricultura', cost: 200, pps: 10, ppc: 0, owned: 0 },
            { id: 'upgrade4', name: 'Metalurgia', cost: 1000, pps: 50, ppc: 0, owned: 0 }
        ]
    },
    {
        nome: 'Idade Média',
        progressoNecessario: 250000,
        image: 'https://i.imgur.com/3Vl7VwD.png',
        upgrades: [
            { id: 'upgrade5', name: 'Pólvora', cost: 5000, pps: 150, ppc: 0, owned: 0 },
            { id: 'upgrade6', name: 'Imprensa', cost: 25000, pps: 500, ppc: 0, owned: 0 }
        ]
    },
    {
        nome: 'Idade Moderna',
        progressoNecessario: 1000000,
        image: 'https://i.imgur.com/4zYgC2b.png',
        upgrades: [
            { id: 'upgrade7', name: 'Motor a Vapor', cost: 100000, pps: 2000, ppc: 0, owned: 0 },
            { id: 'upgrade8', name: 'Eletricidade', cost: 500000, pps: 10000, ppc: 0, owned: 0 }
        ]
    },
    {
        nome: 'Era Espacial',
        progressoNecessario: Infinity,
        image: 'https://i.imgur.com/tD9n48U.png',
        upgrades: [
            { id: 'upgrade9', name: 'Foguete', cost: 2000000, pps: 50000, ppc: 0, owned: 0 },
            { id: 'upgrade10', name: 'Viagem Interstelar', cost: 10000000, pps: 250000, ppc: 0, owned: 0 }
        ]
    }
];

const prestigeUpgrades = [
    { id: 'prestige1', name: 'Multiplicador de Clique x2', cost: 2, multiplier: { ppc: 2 }, owned: false },
    { id: 'prestige2', name: 'Multiplicador de PPS x2', cost: 4, multiplier: { pps: 2 }, owned: false },
    { id: 'prestige3', name: 'Multiplicador de Clique x3', cost: 10, multiplier: { ppc: 3 }, owned: false },
    { id: 'prestige4', name: 'Multiplicador de PPS x3', cost: 20, multiplier: { pps: 3 }, owned: false }
];

let faseAtualIndex = 0;

const progressoEl = document.getElementById('progresso');
const prestigioEl = document.getElementById('prestigio');
const mainButton = document.getElementById('main-button');
const upgradesListEl = document.getElementById('upgrades-list');
const prestigeButton = document.getElementById('prestige-button');
const saveButton = document.getElementById('save-button');
const faseEl = document.getElementById('fase');
const mainImage = document.getElementById('main-image');
const prestigeUpgradesEl = document.getElementById('prestige-upgrades-list');


function updateUI() {
    progressoEl.textContent = Math.floor(progresso);
    prestigioEl.textContent = prestigio;
    faseEl.textContent = fases[faseAtualIndex].nome;
    mainImage.src = fases[faseAtualIndex].image;
    renderUpgrades();
    renderPrestigeUpgrades();
    checkFaseChange();
}

function renderUpgrades() {
    upgradesListEl.innerHTML = '';
    let allUpgrades = [];
    for (let i = 0; i <= faseAtualIndex; i++) {
        allUpgrades = allUpgrades.concat(fases[i].upgrades);
    }

    allUpgrades.forEach(upgrade => {
        const upgradeItem = document.createElement('div');
        upgradeItem.className = 'upgrade-item';
        let upgradeEffect = '';
        if (upgrade.ppc > 0) {
            upgradeEffect += `+${upgrade.ppc} por clique`;
        }
        if (upgrade.pps > 0) {
            if (upgrade.ppc > 0) upgradeEffect += ', ';
            upgradeEffect += `+${upgrade.pps} por segundo`;
        }
        upgradeItem.innerHTML = `
            <span>${upgrade.name} (x${upgrade.owned})</span>
            <span>Custo: ${Math.floor(upgrade.cost)}</span>
            <span>Efeito: ${upgradeEffect}</span>
            <button onclick="buyUpgrade('${upgrade.id}')">Comprar</button>
        `;
        upgradesListEl.appendChild(upgradeItem);
    });
}

function renderPrestigeUpgrades() {
    prestigeUpgradesEl.innerHTML = '';
    prestigeUpgrades.forEach(upgrade => {
        if (!upgrade.owned) {
            const upgradeItem = document.createElement('div');
            upgradeItem.className = 'upgrade-item';
            upgradeItem.innerHTML = `
                <span>${upgrade.name}</span>
                <span>Custo: ${upgrade.cost} de Prestígio</span>
                <button onclick="buyPrestigeUpgrade('${upgrade.id}')">Comprar</button>
            `;
            prestigeUpgradesEl.appendChild(upgradeItem);
        }
    });
}

function buyUpgrade(id) {
    let allUpgrades = [];
    for (let i = 0; i <= faseAtualIndex; i++) {
        allUpgrades = allUpgrades.concat(fases[i].upgrades);
    }
    const upgrade = allUpgrades.find(up => up.id === id);

    if (progresso >= upgrade.cost) {
        progresso -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        progressPerClick += upgrade.ppc;
        progressPerSecond += upgrade.pps;
        updateUI();
    }
}

function buyPrestigeUpgrade(id) {
    const upgrade = prestigeUpgrades.find(up => up.id === id);

    if (prestigio >= upgrade.cost && !upgrade.owned) {
        prestigio -= upgrade.cost;
        upgrade.owned = true;
        applyPrestigeEffects();
        updateUI();
    }
}

function applyPrestigeEffects() {
    let ppcMultiplier = 1;
    let ppsMultiplier = 1;
    prestigeUpgrades.forEach(upgrade => {
        if (upgrade.owned) {
            if (upgrade.multiplier.ppc) ppcMultiplier *= upgrade.multiplier.ppc;
            if (upgrade.multiplier.pps) ppsMultiplier *= upgrade.multiplier.pps;
        }
    });
    progressPerClick = (1 + prestigio * 0.1) * ppcMultiplier;
    progressPerSecond = 0;
    // Reaplicar os upgrades de progresso para a nova base
    let allUpgrades = [];
    fases.forEach(fase => allUpgrades = allUpgrades.concat(fase.upgrades));
    allUpgrades.forEach(upgrade => {
        progressPerClick += upgrade.ppc * upgrade.owned;
        progressPerSecond += upgrade.pps * upgrade.owned;
    });
    progressPerSecond *= ppsMultiplier;
}

function checkFaseChange() {
    if (faseAtualIndex < fases.length - 1 && progresso >= fases[faseAtualIndex].progressoNecessario) {
        faseAtualIndex++;
        updateUI();
        alert(`Parabéns! Você alcançou a fase: ${fases[faseAtualIndex].nome}`);
    }
}

function gainPrestige() {
    if (progresso >= 100000) {
        const gainedPrestige = Math.floor(progresso / 100000);
        prestigio += gainedPrestige;
        resetGame();
        alert(`Você ganhou ${gainedPrestige} de prestígio!`);
    } else {
        alert("Você precisa de pelo menos 100,000 de progresso para ganhar prestígio.");
    }
}

function resetGame() {
    progresso = 0;
    progressPerClick = 1;
    progressPerSecond = 0;
    faseAtualIndex = 0;
    fases.forEach(fase => {
        fase.upgrades.forEach(up => {
            up.owned = 0;
            // Resetar o custo para o valor inicial do upgrade
            if (up.id === 'upgrade1') up.cost = 10;
            if (up.id === 'upgrade2') up.cost = 50;
            if (up.id === 'upgrade3') up.cost = 200;
            if (up.id === 'upgrade4') up.cost = 1000;
            if (up.id === 'upgrade5') up.cost = 5000;
            if (up.id === 'upgrade6') up.cost = 25000;
            if (up.id === 'upgrade7') up.cost = 100000;
            if (up.id === 'upgrade8') up.cost = 500000;
            if (up.id === 'upgrade9') up.cost = 2000000;
            if (up.id === 'upgrade10') up.cost = 10000000;
        });
    });
    applyPrestigeEffects(); // Aplica os multiplicadores do prestígio logo após o reset
    updateUI();
    saveGame();
}

function saveGame() {
    const gameState = {
        progresso,
        prestigio,
        prestigeUpgrades: prestigeUpgrades.map(up => ({ id: up.id, owned: up.owned })),
        progressPerClick,
        progressPerSecond,
        faseAtualIndex,
        fases
    };
    localStorage.setItem('gameSaver', JSON.stringify(gameState));
    alert("Jogo Salvo!");
}

function loadGame() {
    const savedState = localStorage.getItem('gameSaver');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        progresso = gameState.progresso;
        prestigio = gameState.prestigio;
        progressPerClick = gameState.progressPerClick;
        progressPerSecond = gameState.progressPerSecond;
        faseAtualIndex = gameState.faseAtualIndex;
        if (gameState.fases) {
            fases.forEach(fase => {
                const savedFase = gameState.fases.find(sf => sf.nome === fase.nome);
                if (savedFase) {
                    fase.upgrades.forEach(up => {
                        const savedUpgrade = savedFase.upgrades.find(sup => sup.id === up.id);
                        if (savedUpgrade) {
                            up.owned = savedUpgrade.owned;
                            up.cost = savedUpgrade.cost;
                        }
                    });
                }
            });
        }
        if (gameState.prestigeUpgrades) {
            gameState.prestigeUpgrades.forEach(sup => {
                const upgrade = prestigeUpgrades.find(up => up.id === sup.id);
                if (upgrade) {
                    upgrade.owned = sup.owned;
                }
            });
        }
    }
    applyPrestigeEffects();
    updateUI();
}

mainButton.addEventListener('click', () => {
    progresso += progressPerClick;
    updateUI();
});

prestigeButton.addEventListener('click', gainPrestige);
saveButton.addEventListener('click', saveGame);

// Ganhos por segundo
setInterval(() => {
    progresso += progressPerSecond;
    updateUI();
}, 1000);

// Inicializar o jogo
loadGame();