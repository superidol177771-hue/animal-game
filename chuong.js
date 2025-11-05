const animals = ['cat', 'pig', 'chicken', 'duck'];
let selectedAnimal = null;
let lives = 3;
let correctCount = 0;
let startTime = Date.now();
let timerInterval;

const livesEl = document.getElementById('lives');
const heartsEl = document.getElementById('hearts');
const timerEl = document.getElementById('timer');
const messageEl = document.getElementById('message');
const completeOverlay = document.getElementById('complete-overlay');
const gameoverOverlay = document.getElementById('gameover-overlay');
const finalScoreEl = document.getElementById('final-score');
const finalTimeEl = document.getElementById('final-time');
const leaderboardList = document.getElementById('leaderboard-list');

// Bắt đầu đồng hồ
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    timerEl.textContent = elapsed;
  }, 100);
}

// Cập nhật mạng
function updateLives() {
  livesEl.textContent = lives;
  const hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  heartsEl.textContent = hearts;
}

// Chọn con vật
document.querySelectorAll('.animal').forEach(animal => {
  animal.addEventListener('click', () => {
    if (animal.classList.contains('disabled')) return;
    document.querySelectorAll('.animal').forEach(a => a.style.borderColor = '#3498db');
    animal.style.borderColor = '#f39c12';
    selectedAnimal = animal.getAttribute('data-animal');
  });
});

// Chọn chuồng
document.querySelectorAll('.cage').forEach(cage => {
  cage.addEventListener('click', () => {
    if (!selectedAnimal || cage.classList.contains('filled')) return;
    const chosenCage = cage.getAttribute('data-cage');
    checkAnswer(chosenCage, cage);
  });
});

// Kiểm tra đáp án
function checkAnswer(chosenCage, cageEl) {
  const animalEl = document.querySelector(`.animal[data-animal="${selectedAnimal}"]`);

  if (chosenCage === selectedAnimal) {
    messageEl.textContent = 'Đúng rồi!';
    messageEl.className = 'message correct';
    correctCount++;
    moveToCage(animalEl, cageEl);
  } else {
    messageEl.textContent = 'Không đúng!';
    messageEl.className = 'message wrong';
    lives--;
    updateLives();
    if (lives <= 0) {
      setTimeout(() => gameoverOverlay.style.display = 'flex', 1000);
    }
  }

  selectedAnimal = null;
  document.querySelectorAll('.animal').forEach(a => a.style.borderColor = '#3498db');

  if (correctCount === 4) {
    setTimeout(showComplete, 1200);
  }
}

// Di chuyển con vật vào chuồng
function moveToCage(animalEl, cageEl) {
  const clone = document.createElement('div');
  clone.className = 'placed';
  clone.innerHTML = `<img src="${animalEl.querySelector('img').src}" />`;
  cageEl.appendChild(clone);

  animalEl.classList.add('disabled');
  cageEl.classList.add('filled');
}

// Màn hình hoàn thành
function showComplete() {
  clearInterval(timerInterval);
  const time = ((Date.now() - startTime) / 1000).toFixed(1);
  finalScoreEl.textContent = correctCount;
  finalTimeEl.textContent = time + 's';
  loadLeaderboard();
  completeOverlay.style.display = 'flex';
}

// Bảng xếp hạng
function saveScore() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput.value.trim() || 'Ẩn danh';
  const time = ((Date.now() - startTime) / 1000).toFixed(1);
  const score = { name, score: correctCount, time: parseFloat(time) };
  
  let leaderboard = JSON.parse(localStorage.getItem('animalGameLB') || '[]');
  leaderboard.push(score);
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem('animalGameLB', JSON.stringify(leaderboard));
  loadLeaderboard();
}

function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('animalGameLB') || '[]');
  leaderboardList.innerHTML = '';
  leaderboard.forEach((entry, i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${entry.name} - ${entry.score} điểm (${entry.time}s)`;
    leaderboardList.appendChild(li);
  });
}

function restartGame() {
  location.reload();
}

// Gắn sự kiện cho nút
document.getElementById('save-score-btn').addEventListener('click', saveScore);
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('retry-btn').addEventListener('click', restartGame);

// Khởi động
updateLives();
startTimer();