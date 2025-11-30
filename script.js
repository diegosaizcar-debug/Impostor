// Diccionario de categorías y palabras
const CATEGORIES = {
    "Lugares Comunes": [
        "Playa", "Bosque", "Escuela", "Hospital", "Restaurante", 
        "Biblioteca", "Gimnasio", "Supermercado", "Avión", "Barco",
        "Teatro", "Parque", "Cafetería", "Banco", "Cine", "Museo",
        "Oficina", "Farmacia", "Estación", "Ascensor"
    ],
    "Animales y Naturaleza": [
        "Elefante", "Jirafa", "Cocodrilo", "Mariposa", "Pingüino",
        "Volcán", "Desierto", "Océano", "Montaña", "Arcoíris",
        "Canguro", "Abeja", "Hormiga", "Cebra", "Koala", "León",
        "Serpiente", "Hielo", "Cueva", "Tornado"
    ],
    "Objetos del Hogar": [
        "Refrigerador", "Sofá", "Televisión", "Microondas", "Sábana",
        "Escoba", "Cepillo", "Ventana", "Almohada", "Tostadora",
        "Espejo", "Cuchillo", "Lámpara", "Mesa", "Cortina", "Reloj",
        "Candelabro", "Alfombra", "Paraguas", "Taza"
    ],
    "Alimentos": [
        "Aguacate", "Sandía", "Brócoli", "Hamburguesa", "Spaghetti",
        "Chocolate", "Cereza", "Panqueque", "Zanahoria", "Pimienta",
        "Sushi", "Naranja", "Galleta", "Pera", "Mango", "Queso",
        "Tomate", "Manzana", "Fresa", "Café"
    ],
    // NUEVAS CATEGORÍAS
    "Tecnología y Gadgets": [
        "Teléfono", "Auriculares", "Portátil", "Teclado", "Ratón",
        "Impresora", "Cámara", "Altavoz", "Proyector", "Batería",
        "Dron", "Cable", "Micrófono", "Antena", "Satélite", "Memoria",
        "Robot", "Router", "Pantalla", "Código"
    ],
    "Ropa y Accesorios": [
        "Bufanda", "Gorro", "Chaqueta", "Calcetín", "Corbata",
        "Pendiente", "Collar", "Anillo", "Cartera", "Guantes",
        "Cinturón", "Vestido", "Falda", "Zapatilla", "Bañador", "Tacón",
        "Pijama", "Bolsa", "Tirantes", "Gafas"
    ],
    "Hogar y Arquitectura": [
        "Chimenea", "Escalera", "Balcón", "Terraza", "Garaje",
        "Azotea", "Sótano", "Ladrillo", "Cemento", "Tubería",
        "Grifo", "Pared", "Techo", "Suelo", "Ventilador", "Jardín",
        "Pasillo", "Puerta", "Despensa", "Balda"
    ],
    "Vehículos y Transporte": [
        "Tren", "Bicicleta", "Autobús", "Metro", "Helicóptero",
        "Submarino", "Cohete", "Motocicleta", "Patinete", "Camión",
        "Neumático", "Freno", "Motor", "Gasolina", "Rueda", "Vela",
        "Tractor", "Coche", "Globo", "Caravana"
    ],
    "Mixto y Abstracto": [
        "Felicidad", "Misterio", "Silencio", "Sombra", "Evolución",
        "Universo", "Amistad", "Sueño", "Historia", "Tiempo",
        "Magia", "Gravedad", "Idea", "Ritmo", "Poesía", "Caos",
        "Justicia", "Leyenda", "Eco", "Vibración"
    ]
};

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
    const categoryName = document.getElementById('category-select').value;
    
    // Procesa los nombres
    let playerNames = namesInput.split(',')
                                .map(name => name.trim())
                                .filter(name => name.length > 0);
    
    totalPlayers = playerNames.length;

    // Validación
    if (totalPlayers < 3 || numImpostors < 1 || numImpostors >= totalPlayers) {
        alert("Configuración inválida. Necesitas al menos 3 jugadores y al menos un tripulante.");
        return;
    }

    // Seleccionar palabra aleatoria de la categoría elegida
    const wordList = CATEGORIES[categoryName];
    if (!wordList || wordList.length === 0) {
        alert("Error: La categoría seleccionada no tiene palabras.");
        return;
    }
    const randomIndex = Math.floor(Math.random() * wordList.length);
    secretWord = wordList[randomIndex];

    // Asignación de roles
    players = playerNames.map(name => ({ name: name, role: 'Tripulante' }));
    
    let assignedImpostors = 0;
    while (assignedImpostors < numImpostors) {
        const idx = Math.floor(Math.random() * players.length);
        if (players[idx].role === 'Tripulante') {
            players[idx].role = 'Impostor';
            assignedImpostors++;
        }
    }
    
    // Preparar la pantalla para el primer jugador
    hideAllScreens();
    currentPlayerIndex = 0;
    document.getElementById('role-card').style.display = 'block';
    nextPlayerTurn();
}

// 2. Muestra la tarjeta del jugador actual o la pantalla de "Partida en Curso"
function nextPlayerTurn() {
    if (currentPlayerIndex >= totalPlayers) {
        hideAllScreens();
        document.getElementById('ongoing-game').style.display = 'block';
        return;
    }

    const player = players[currentPlayerIndex];
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
        li.textContent = `${player.name}: ${player.role}`; 
        li.className = player.role === 'Impostor' ? 'impostor' : 'crewmate';
        finalRolesList.appendChild(li);
    });
}

// 7. Reiniciar el juego
function resetGame() {
    hideAllScreens();
    document.getElementById('setup').style.display = 'block';
    document.getElementById('player-names').value = ''; 
    players = [];
    secretWord = "";
    currentPlayerIndex = 0;
    totalPlayers = 0;
}

// Función para inicializar el selector de categorías al cargar la página
function initCategorySelect() {
    const select = document.getElementById('category-select');
    if (!select) return; 

    // Limpia opciones previas (si las hubiera)
    select.innerHTML = ''; 

    for (const category in CATEGORIES) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    }
}

// Llama a la inicialización de categorías al cargar el script
document.addEventListener('DOMContentLoaded', initCategorySelect);
