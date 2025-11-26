const playerInput = document.getElementById('playerInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const clearPlayersBtn = document.getElementById('clearPlayersBtn');
const playersListEl = document.getElementById('playersList');

const drawBtn = document.getElementById('drawBtn');
const results = document.getElementById('results');
const warning = document.getElementById('warning');
const reservesBox = document.getElementById('reservesBox');
const reservesList = document.getElementById('reservesList');

const teamSizeInput = document.getElementById('teamSize');
const subtitleEl = document.getElementById('subtitle');
const teamInfoEl = document.getElementById('teamInfo');

let players = [];
let teamSize = parseInt(teamSizeInput.value, 10) || 6;

function updateTeamSizeUI() {
  let value = parseInt(teamSizeInput.value, 10);
  if (isNaN(value) || value < 3) value = 3;
  if (value > 20) value = 20;

  teamSize = value;
  teamSizeInput.value = value;

  subtitleEl.textContent =
    `Cada time terá ${teamSize} jogadores (1 goleiro + ${teamSize - 1} na linha)`;
  teamInfoEl.textContent =
    `Mínimo: ${teamSize} jogadores para formar 1 time.`;
}

function renderPlayers() {
  playersListEl.innerHTML = '';

  if (players.length === 0) {
    const emptyMsg = document.createElement('span');
    emptyMsg.style.fontSize = '0.85rem';
    emptyMsg.style.color = '#6b7280';
    emptyMsg.textContent = 'Nenhum jogador adicionado ainda.';
    playersListEl.appendChild(emptyMsg);
    return;
  }

  players.forEach((name, index) => {
    const chip = document.createElement('div');
    chip.className = 'player-chip';

    const label = document.createElement('span');
    label.textContent = `${index + 1}. ${name}`;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'player-remove';
    removeBtn.textContent = '×';
    removeBtn.title = 'Remover jogador';
    removeBtn.addEventListener('click', () => {
      players.splice(index, 1);
      renderPlayers();
    });

    chip.appendChild(label);
    chip.appendChild(removeBtn);
    playersListEl.appendChild(chip);
  });
}

function addPlayer() {
  const name = playerInput.value.trim();
  if (!name) return;

  players.push(name);
  playerInput.value = '';
  playerInput.focus();
  renderPlayers();
}

function clearPlayers() {
  if (players.length === 0) return;
  if (!confirm('Tem certeza que deseja limpar toda a lista de jogadores?')) return;
  players = [];
  renderPlayers();
  results.innerHTML = '';
  warning.textContent = '';
  reservesBox.style.display = 'none';
  reservesList.textContent = '';
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function drawTeams() {
  updateTeamSizeUI();

  if (players.length < teamSize) {
    alert(`Você precisa de pelo menos ${teamSize} jogadores para formar um time.`);
    return;
  }

  const shuffled = shuffle([...players]);

  const numTeams = Math.floor(shuffled.length / teamSize);
  const totalUsed = numTeams * teamSize;
  const reserves = shuffled.slice(totalUsed);

  results.innerHTML = '';
  warning.textContent = '';

  if (numTeams === 0) {
    warning.textContent = 'Não foi possível formar nenhum time completo.';
    reservesBox.style.display = 'none';
    return;
  }

  warning.textContent = `Foram formados ${numTeams} time(s) completo(s).`;

  for (let t = 0; t < numTeams; t++) {
    const teamPlayers = shuffled.slice(
      t * teamSize,
      (t + 1) * teamSize
    );

    const gkIndex = Math.floor(Math.random() * teamSize);

    const card = document.createElement('div');
    card.className = 'team-card';

    const header = document.createElement('div');
    header.className = 'team-header';

    const title = document.createElement('div');
    title.className = 'team-title';
    title.textContent = `Time ${t + 1}`;

    const subtitle = document.createElement('div');
    subtitle.className = 'team-subtitle';
    subtitle.textContent = `1 goleiro, ${teamSize - 1} na linha`;

    header.appendChild(title);
    header.appendChild(subtitle);
    card.appendChild(header);

    const list = document.createElement('ul');

    teamPlayers.forEach((player, index) => {
      const li = document.createElement('li');

      if (index === gkIndex) {
        const spanName = document.createElement('span');
        spanName.textContent = player;
        spanName.className = 'gk';

        const badge = document.createElement('span');
        badge.className = 'badge-gk';
        badge.textContent = 'Goleiro';

        li.appendChild(spanName);
        li.appendChild(badge);
      } else {
        li.textContent = player;
      }

      list.appendChild(li);
    });

    card.appendChild(list);
    results.appendChild(card);
  }

  if (reserves.length > 0) {
    reservesBox.style.display = 'block';
    reservesList.textContent = reserves.join(' · ');
  } else {
    reservesBox.style.display = 'none';
    reservesList.textContent = '';
  }
}

// eventos
addPlayerBtn.addEventListener('click', addPlayer);

playerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addPlayer();
  }
});

clearPlayersBtn.addEventListener('click', clearPlayers);
drawBtn.addEventListener('click', drawTeams);

teamSizeInput.addEventListener('change', updateTeamSizeUI);
teamSizeInput.addEventListener('blur', updateTeamSizeUI);

// estado inicial
updateTeamSizeUI();
renderPlayers();
