<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thả Vật Vào Chuồng</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
      color: #2c3e50;
      text-align: center;
      padding: 20px;
      min-height: 100vh;
    }
    h1 { margin-bottom: 15px; font-size: 28px; color: #2c3e50; }
    .info {
      display: flex;
      justify-content: center;
      gap: 50px;
      margin-bottom: 25px;
      font-weight: bold;
      font-size: 19px;
    }
    .lives { color: #e74c3c; }
    .timer { color: #27ae60; }

    .game-container {
      display: flex;
      justify-content: center;
      gap: 140px;
      flex-wrap: wrap;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    /* Con vật: CHỈ ẢNH, KHÔNG CHỮ */
    .animal {
      width: 130px;
      height: 130px;
      border: 4px solid #3498db;
      border-radius: 22px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }
    .animal:hover { transform: translateY(-6px); }
    .animal.disabled {
      opacity: 0.4;
      pointer-events: none;
      border-color: #95a5a6;
    }
    .animal img { width: 80px; height: 80px; pointer-events: none; }

    /* Chuồng: GIỮ TÊN */
    .cage {
      width: 130px;
      height: 130px;
      border: 4px solid #27ae60;
      border-radius: 22px;
      background: #f8f9fa;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .cage:hover { transform: translateY(-6px); }
    .cage.filled {
      opacity: 0.5;
      pointer-events: none;
      border-color: #95a5a6;
    }
    .cage img { width: 70px; height: 70px; pointer-events: none; }
    .cage .label {
      font-size: 15px;
      font-weight: bold;
      margin-top: 8px;
      color: #27ae60;
      pointer-events: none;
    }

    /* Con vật nhỏ trong chuồng */
    .placed {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      pointer-events: none;
    }
    .placed img { width: 40px; height: 40px; }

    .message {
      margin: 20px 0;
      font-size: 26px;
      font-weight: bold;
      min-height: 40px;
    }
    .correct { color: #27ae60; animation: bounce 0.5s; }
    .wrong { color: #e74c3c; animation: shake 0.5s; }

    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

    /* Màn hình kết thúc */
    .overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal {
      background: white;
      padding: 35px;
      border-radius: 28px;
      width: 90%;
      max-width: 430px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    }
    .modal h2 { margin-bottom: 20px; font-size: 28px; color: #2c3e50; }
    .modal p { margin: 12px 0; font-size: 18px; }
    .modal input {
      padding: 14px;
      width: 88%;
      margin: 18px 0;
      font-size: 17px;
      border: 2px solid #ddd;
      border-radius: 12px;
    }
    .modal button {
      margin: 12px 10px;
      padding: 15px 30px;
      font-size: 18px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      min-width: 130px;
    }
    .modal button:hover { background: #2980b9; }

    .leaderboard {
      margin-top: 25px;
      text-align: left;
      max-height: 230px;
      overflow-y: auto;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 14px;
      font-size: 15px;
    }
    .leaderboard h3 { margin-bottom: 12px; text-align: center; font-size: 19px; }
    .leaderboard ol { padding-left: 25px; }
    .leaderboard li { margin: 10px 0; font-family: monospace; }
  </style>
</head>
<body>

  <h1>Thả Vật Vào Đúng Chuồng!</h1>
  <div class="info">
    <div class="lives">Mạng: <span id="lives">3</span> ❤️❤️❤️</div>
    <div class="timer">Thời gian: <span id="timer">0</span>s</div>
  </div>

  <div class="game-container">
    <!-- CỘT CON VẬT: CHỈ ẢNH -->
    <div class="column">
      <div class="animal" data-animal="cat">
        <img src="https://img.icons8.com/emoji/80/cat.png" alt="Mèo"/>
      </div>
      <div class="animal" data-animal="pig">
        <img src="https://img.icons8.com/emoji/80/pig.png" alt="Lợn"/>
      </div>
      <div class="animal" data-animal="chicken">
        <img src="https://img.icons8.com/emoji/80/chicken.png" alt="Gà"/>
      </div>
      <div class="animal" data-animal="duck">
        <img src="https://img.icons8.com/emoji/80/duck.png" alt="Vịt"/>
      </div>
    </div>

    <!-- CỘT CHUỒNG: GIỮ TÊN -->
    <div class="column">
      <div class="cage" data-cage="cat">
        <img src="https://img.icons8.com/color/70/cat-house.png" alt="Chuồng mèo"/>
        <div class="label">Chuồng Mèo</div>
      </div>
      <div class="cage" data-cage="pig">
        <img src="https://img.icons8.com/color/70/piggy-bank.png" alt="Chuồng lợn"/>
        <div class="label">Chuồng Lợn</div>
      </div>
      <div class="cage" data-cage="chicken">
        <img src="https://img.icons8.com/color/70/chicken.png" alt="Chuồng gà"/>
        <div class="label">Chuồng Gà</div>
      </div>
      <div class="cage" data-cage="duck">
        <img src="https://img.icons8.com/color/70/duck.png" alt="Chuồng vịt"/>
        <div class="label">Chuồng Vịt</div>
      </div>
    </div>
  </div>

  <div class="message" id="message"></div>

  <!-- Màn hình hoàn thành -->
  <div class="overlay" id="complete-overlay">
    <div class="modal">
      <h2>GAME COMPLETE!</h2>
      <p>Score: <strong id="final-score">4</strong></p>
      <p>Time: <strong id="final-time">31.8s</strong></p>
      <p>You're on the leaderboard!</p>
      <input type="text" id="player-name" placeholder="Nhập tên của bạn" maxlength="15"/>
      <button onclick="saveScore()">Lưu Điểm</button>
      <button onclick="restartGame()">Start again</button>
      <div class="leaderboard" id="leaderboard">
        <h3>Bảng Xếp Hạng</h3>
        <ol id="leaderboard-list"></ol>
      </div>
    </div>
  </div>

  <!-- Màn hình thua -->
  <div class="overlay" id="gameover-overlay">
    <div class="modal">
      <h2>GAME OVER!</h2>
      <p>Bạn đã hết mạng!</p>
      <button onclick="restartGame()">Thử lại</button>
    </div>
  </div>

  <script>
    const animals = ['cat', 'pig', 'chicken', 'duck'];
    let selectedAnimal = null;
    let lives = 3;
    let correctCount = 0;
    let startTime = Date.now();
    let timerInterval;

    const livesEl = document.getElementById('lives');
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
      livesEl.nextSibling.textContent = ' ' + hearts;
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
      const name = document.getElementById('player-name').value.trim() || 'Ẩn danh';
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

    // Khởi động
    updateLives();
    startTimer();
  </script>
</body>
</html>
