const WORDS = [
    "Playa", "Bosque", "Escuela", "Hospital", "Restaurante", 
    "Biblioteca", "Gimnasio", "Supermercado", "Avión", "Barco",
    "Circo", "Museo", "Cine", "Fiesta", "Ascensor", "Cocina" 
];

let players = [];
let secretWord = "";
let currentPlayerIndex = 0;
let totalPlayers = 0;

// Oculta todas las pantallas de juego
function hideAllScreens() {
    document.getElementById('setup').style.display = 'none';
    document.getElementById('role-card').style.display = 'none';
    document.getElementById('ongoing-game').style.display = 'none';
    document.getElementById('end-game').style.display = 'none';
}

// 1. Iniciar el juego
function startGame() {
    const namesInput = document.getElementById('player-names').value;
    const numImpostors = parseInt(document.getElementById('num-impostors').value);
    
    // Procesa los nombres: divide por coma, elimina espacios, y filtra vacíos
    let playerNames = namesInput.split(',')
                                .map(name => name.trim())
                                .filter(name => name.length > 0);
    
    totalPlayers = playerNames.length;

    // Validación de entradas
    if (totalPlayers < 3 || numImpostors < 1 || numImpostors >= totalPlayers) {
        alert("Configuración inválida. Necesitas al menos 3 jugadores y al menos un tripulante.");
        return;
    }

    // A. Seleccionar palabra secreta aleatoria
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    secretWord = WORDS[randomIndex];

    // B. Crear lista de jugadores con nombres y asignar roles
    players = playerNames.map(name => ({ name: name, role: 'Tripulante' }));
    
    let assignedImpostors = 0;
    while (assignedImpostors < numImpostors) {
        const idx = Math.floor(Math.random() * players.length);
        if (players[idx].role === 'Tripulante') {
            players[idx].role = 'Impostor';
            assignedImpostors++;
        }
    }
    
    // C. Preparar la pantalla para el primer jugador
    hideAllScreens();
    currentPlayerIndex = 0;
    document.getElementById('role-card').style.display = 'block';
    nextPlayerTurn();
}

// 2. Muestra la tarjeta del jugador actual o la pantalla de "Partida en Curso"
function nextPlayerTurn() {
    if (currentPlayerIndex >= totalPlayers) {
        // Todos han visto su rol, pasar a la pantalla de Partida en Curso
        hideAllScreens();
        document.getElementById('ongoing-game').style.display = 'block';
        return;
    }

    const player = players[currentPlayerIndex];
    
    // Muestra el nombre del jugador actual
    document.getElementById('current-player-name').textContent = player.name; 
    
    document.getElementById('role-display').style.display = 'none';
    document.querySelector('#role-card > button').style.display = 'block'; 
}

// 3. Muestra el rol específico al jugador
function showRole() {
    const player = players[currentPlayerIndex];
    const roleSpan = document.getElementById('role');
    const wordDisplay = document.getElementById('secret-word-display');

    roleSpan.textContent = player.role;
    roleSpan.className = player.role === 'Impostor' ? 'impostor-role' : 'crew-role';

    if (player.role === 'Tripulante') {
        wordDisplay.innerHTML = `La palabra es: <span style="color: #f7b32b;">${secretWord}</span>`;
    } else {
        wordDisplay.innerHTML = `**No sabes la palabra.** Tu misión es **fingir** que la sabes.`;
    }

    document.getElementById('role-display').style.display = 'block';
    document.querySelector('#role-card > button').style.display = 'none'; 
}

// 4. Oculta el rol y avanza al siguiente
function hideRole() {
    document.getElementById('role-display').style.display = 'none';
    currentPlayerIndex++;
    nextPlayerTurn();
}

// 5. Muestra la pantalla de resultados (Revelación)
function revealRoles() {
    hideAllScreens();
    document.getElementById('end-game').style.display = 'block';
    document.getElementById('final-word').innerHTML = `La palabra secreta era: <span style="color: #f7b32b; font-size: 1.4em;">${secretWord}</span>`;
    displayFinalRoles();
}

// 6. Muestra la lista final de roles (usando nombres)
function displayFinalRoles() {
    const finalRolesList = document.getElementById('final-roles-list');
    finalRolesList.innerHTML = '';
    
    players.forEach(player => {
        const li = document.createElement('li');
        // Usamos el nombre en lugar del ID
        li.textContent = `${player.name}: ${player.role}`; 
        li.className = player.role === 'Impostor' ? 'impostor' : 'crewmate';
        finalRolesList.appendChild(li);
    });
}

// 7. Reiniciar el juego
function resetGame() {
    hideAllScreens();
    document.getElementById('setup').style.display = 'block';
    // Opcional: limpiar el campo de nombres al reiniciar
    document.getElementById('player-names').value = ''; 
    players = [];
    secretWord = "";
    currentPlayerIndex = 0;
    totalPlayers = 0;
}