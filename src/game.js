// Define game state
let sokoban = [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];

// Define player position
let playerPos = { x: 1, y: 1};

// Define box positions
let boxPos = [{ x: 3, y: 3 }, { x: 4, y: 3 }];

// Define target positions
let targetPos = [{ x: 5, y: 3 }, { x: 6, y: 3} ];

// Initialize target states
let targetStates = []; // This will track whether each target cell is still present or not
for (let y = 0; y < sokoban.length; y++) {
    targetStates[y] = [];
    for (let x = 0; x < sokoban[y].length; x++) {
        targetStates[y][x] = targetPos.some(pos => pos.x === x && pos.y === y);
    }
}

// Function to render the game
function render() {
    let table = document.getElementById("sokoban");
    table.innerHTML = '';

    sokoban.map((row, y) => {
        let newRow = table.insertRow();
        row.map((cellContent, x) => {
            let cell = newRow.insertCell();
            cell.classList.add(cellContent);
            if (x === playerPos.x && y === playerPos.y) {
                cell.textContent = 'P';
            } else if (boxPos.some(pos => pos.x === x && pos.y === y)) {
                cell.textContent = 'B';
            } else if (targetStates[y][x]) {
                cell.textContent = 'T';
                cell.classList.add('target');
                cell.style.backgroundColor = 'yellow'
            }
            // Add class name based on cell content
            if (cell.textContent === 'P') {
                cell.classList.add('player');
                cell.style.backgroundColor = 'blue';
            } else if (cell.textContent === 'B') {
                cell.classList.add('box');
                cell.style.backgroundColor = 'brown';
            } else if (cellContent === 'wall') {
                cell.style.backgroundColor = 'gray';
            }
        });
    });

    let targetsRemaining = targetStates.flat().some(state => state);

    if (!targetsRemaining) {
        let message = document.createElement('p');
        message.textContent = "You have finished the game";
        document.body.appendChild(message);
    }
}


// Function to move the player
function move(dx, dy) {
    let newX = playerPos.x + dx;
    let newY = playerPos.y + dy;
    if (sokoban[newY][newX] !== 'wall') {
        if (boxPos.some(pos => pos.x === newX && pos.y === newY)) {
            let newBoxX = newX + dx;
            let newBoxY = newY + dy;
            if (sokoban[newBoxY][newBoxX] !== 'wall' && !boxPos.some(pos => pos.x === newBoxX && pos.y === newBoxY)) {
                let index = boxPos.findIndex(pos => pos.x === newX && pos.y === newY);
                boxPos[index].x = newBoxX;
                boxPos[index].y = newBoxY;
                playerPos.x = newX;
                playerPos.y = newY;
                // Check if the box is on a target cell
                let targetIndex = targetPos.findIndex(pos => pos.x === newBoxX && pos.y === newBoxY);
                if (targetIndex !== -1) {
                    // Update the target state
                    targetStates[newBoxY][newBoxX] = false;
                    
                }
            }
        } else {
            playerPos.x = newX;
            playerPos.y = newY;
        }
    }
    render();
}

// Event listener for key presses
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            move(0, -1);
            break;
        case 'ArrowDown':
            move(0, 1);
            break;
        case 'ArrowLeft':
            move(-1, 0);
            break;
        case 'ArrowRight':
            move(1, 0);
            break;
    }
});

// Initialize the game
render();

