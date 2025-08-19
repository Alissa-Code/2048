document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const scoreDisplay = document.getElementById('score');
  let score = 0;
  let grid = [];
  const gridSize = 4;

  // Initialize grid
  function setup() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      gameBoard.appendChild(cell);
    }
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    addRandomTile();
    addRandomTile();
    updateDisplay();
  }

  // Add a random tile (2 or 4)
  function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 0) {
          emptyTiles.push({ r, c });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[r][c] = Math.random() > 0.9 ? 4 : 2;
    }
  }

  // Update the display
  function updateDisplay() {
    const existingTiles = document.querySelectorAll('.tile');
    existingTiles.forEach(tile => tile.remove());

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] !== 0) {
          const tile = document.createElement('div');
          tile.classList.add('tile');
          tile.dataset.value = grid[r][c];
          tile.textContent = grid[r][c];
          const cell = gameBoard.children[r * gridSize + c];
          const rect = cell.getBoundingClientRect();
          tile.style.top = `${rect.top}px`;
          tile.style.left = `${rect.left}px`;
          gameBoard.appendChild(tile);
        }
      }
    }
    scoreDisplay.textContent = score;
  }
  
  // Handle key presses (REMOVED FOR MOBILE)
  // document.addEventListener('keydown', (e) => {
  //   let moved = false;
  //   switch (e.key) {
  //     case 'ArrowUp':
  //       moved = moveUp();
  //       break;
  //     case 'ArrowDown':
  //       moved = moveDown();
  //       break;
  //     case 'ArrowLeft':
  //       moved = moveLeft();
  //       break;
  //     case 'ArrowRight':
  //       moved = moveRight();
  //       break;
  //   }
  //   if (moved) {
  //     addRandomTile();
  //     updateDisplay();
  //     // Add game over check here
  //   }
  // });

  // Handle touch events for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault(); // Prevent scrolling
  }, { passive: false });

  gameBoard.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
  }, { passive: false });

  gameBoard.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    let moved = false;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
      if (dx > 0) {
        moved = moveRight();
      } else {
        moved = moveLeft();
      }
    } else { // Vertical swipe
      if (dy > 0) {
        moved = moveDown();
      } else {
        moved = moveUp();
      }
    }

    if (moved) {
      addRandomTile();
      updateDisplay();
      // Add game over check here
    }
  });

  function slide(row) {
    let arr = row.filter(val => val);
    let missing = gridSize - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
  }

  function combine(row) {
    for (let i = 0; i < gridSize - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }
    return row;
  }

  function moveLeft() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
      const originalRow = [...grid[r]];
      let row = grid[r];
      row = slide(row);
      row = combine(row);
      row = slide(row);
      grid[r] = row;
      if (JSON.stringify(originalRow) !== JSON.stringify(grid[r])) {
        moved = true;
      }
    }
    return moved;
  }

  function moveRight() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
      const originalRow = [...grid[r]];
      let row = grid[r].reverse();
      row = slide(row);
      row = combine(row);
      row = slide(row);
      grid[r] = row.reverse();
      if (JSON.stringify(originalRow) !== JSON.stringify(grid[r])) {
        moved = true;
      }
    }
    return moved;
  }

  function transpose() {
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        newGrid[c][r] = grid[r][c];
      }
    }
    grid = newGrid;
  }

  function moveUp() {
    transpose();
    const moved = moveLeft();
    transpose();
    return moved;
  }

  function moveDown() {
    transpose();
    const moved = moveRight();
    transpose();
    return moved;
  }

  setup();
});