var state = { board: [], currentGame: [], savedGames: [] };

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }
  var savedGamesFromLocalST = window.localStorage.getItem('saved-games');
  if (savedGamesFromLocalST) {
    state.savedGames = JSON.parse(savedGamesFromLocalST);
  }
  console.log(window.localStorage);
}

function writeLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  state.board = [];
  for (var i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  state.currentGame = [];
  render();
}

function render() {
  renderBoard();
  renderButton();
  renderSavedGames();
}

function renderBoard() {
  var divBoard = document.querySelector('#megasena-board');
  divBoard.innerHTML = '';
  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');
  for (var i = 0; i < state.board.length; i++) {
    var currentNumber = state.board[i];
    var liNumber = document.createElement('li');
    liNumber.classList.add('number');
    liNumber.textContent = currentNumber;
    liNumber.addEventListener('click', handleNumberClick);
    if (isNumberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }
    ulNumbers.appendChild(liNumber);
  }
  divBoard.appendChild(ulNumbers);
}

function renderButton() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';
  divButtons.classList.add('botao');
  var buttonNewGame = createNewGameButton();
  divButtons.appendChild(buttonNewGame);
  var randomGameButton = createRandomGameButton();
  divButtons.appendChild(randomGameButton);
  var saveGameButton = createSaveGameButton();
  divButtons.appendChild(saveGameButton);
  var buttonLSClear = createLSButton();
  divButtons.appendChild(buttonLSClear);
}

function createLSButton() {
  var button = document.createElement('button');
  button.textContent = 'Limpar Jogos!';
  button.disabled = hasStorage();
  button.addEventListener('click', deleteGames);
  return button;
}

function createSaveGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Salvar jogo.';
  button.disabled = !isGameComplete();
  button.addEventListener('click', saveGame);
  return button;
}

function createRandomGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Jogo Aleatório.';
  button.addEventListener('click', randomGame);
  return button;
}

function createNewGameButton() {
  var button = document.createElement('button');
  button.textContent = 'Novo Jogo.';
  button.addEventListener('click', newGame);
  return button;
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';
  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>';
  } else {
    divSavedGames.innerHTML = '<p>Jogos Salvos</p>';
    var ulSavedGames = document.createElement('ul');
    ulSavedGames.classList.add('save-game-list');
    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];
      var liGame = document.createElement('li');
      var numerosSalvos = currentGame
        .map(number => number.toString().padStart(2, '0'))
        .join(' ');
      liGame.textContent = numerosSalvos;
      liGame.classList.add('save-game-number');
      ulSavedGames.appendChild(liGame);
    }
    divSavedGames.appendChild(ulSavedGames);
  }
}

function randomGame() {
  newGame();
  while (!isGameComplete()) {
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber);
  }
  render();
}

function handleNumberClick(event) {
  var value = Number(event.currentTarget.textContent);
  if (isNumberInGame(value)) {
    removeNumberFromGame(value);
  } else {
    addNumberToGame(value);
  }
  console.log(state.currentGame);
  render();
}

function addNumberToGame(numberToAdd) {
  if (state.currentGame.length >= 6) {
    console.error('Jogo já está completo.');
    return;
  }
  state.currentGame.push(numberToAdd);
  render();
}

function removeNumberFromGame(numberToRemove) {
  if (numberToRemove < 1 || numberToRemove > 60) {
    console.error('Número inválido.', numberToRemove);
    return;
  }
  var newGame = [];
  for (var i = 0; i < state.currentGame.length; i++) {
    var currentNumber = state.currentGame[i];
    if (currentNumber === numberToRemove) {
      continue;
    }
    newGame.push(currentNumber);
  }
  state.currentGame = newGame;
  render();
}

function isNumberInGame(numberToCheck) {
  // if (state.currentGame.includes(numberToCheck)) {
  //   return true;
  // } << refatorando
  return state.currentGame.includes(numberToCheck);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo não está completo', isGameComplete);
    return;
  }
  state.currentGame = state.currentGame.sort((a, b) => a - b);
  state.savedGames.push(state.currentGame);
  writeLocalStorage();
  newGame();
}

function deleteGames() {
  var okToDelete = confirm('Realmente deseja limpar os Jogos?');
  if (okToDelete) {
    localStorage.clear();
    setTimeout(location.reload(true), 0);
  }
}

function isGameComplete() {
  return state.currentGame.length === 6;
}

function hasStorage() {
  return window.localStorage.length === 0;
}

function resetGame() {
  newGame();
}

start();
