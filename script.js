// Основной скрипт для КИБЕРПОЛИС

document.addEventListener('DOMContentLoaded', () => {
    const rulesBtn = document.getElementById('rules-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const gameBoardBtn = document.getElementById('game-board-btn');
    const mainContent = document.getElementById('main-content');

    // Навигация
    rulesBtn.addEventListener('click', () => loadRules());
    newGameBtn.addEventListener('click', () => loadNewGame());
    gameBoardBtn.addEventListener('click', () => loadGameBoard());

    function loadRules() {
        mainContent.innerHTML = `
            <section id="rules">
                <h2>Правила игры КИБЕРПОЛИС</h2>
                <p>Добро пожаловать в Киберполис! Гигантская корпорация, управлявшая этим мегаполисом, пала. Теперь улицы погрузились в хаос и анархию. Вы — лидеры могущественных фракций, боровшихся за власть в тени, и теперь ваш час настал.</p>
                <h3>Цель игры</h3>
                <p>Установить контроль над ключевыми районами города, выполнить выгодные контракты и переиграть соперников с помощью хитрости, силы или щедрых обещаний.</p>
                <h3>Компоненты</h3>
                <ul>
                    <li>24 района с киберпанковыми названиями</li>
                    <li>Карты Кредитов, Власти и Ролей</li>
                    <li>Кубики для движения</li>
                </ul>
                <h3>Роли</h3>
                <ul>
                    <li><strong>ХАКЕР:</strong> Тень в сети. Раз в ход подсматривает миссию соперника. +1 Данные с районов.</li>
                    <li><strong>КОРПОРАТ:</strong> Деньги правят миром. +5 Кредитов старт. Может брать долги.</li>
                    <li><strong>НОМАД:</strong> Выживаете там, где другие паникуют. +1 клетка движения. Не платит аренду на нейтральных.</li>
                    <li><strong>ИНЖЕНЕР:</strong> Превращает хлам в шедевры. Модернизация за -1 Данные. Ремонт имплантов.</li>
                    <li><strong>АГЕНТ КБ:</strong> Наводит порядок. Выигрывает при ничье в конфликтах. Штрафы.</li>
                    <li><strong>КИБЕР-ЖРЕЦ:</strong> Пророк цифрового мира. Благословения и проклятия.</li>
                </ul>
                <h3>Механика</h3>
                <p>Игроки двигаются по районам, покупают их, собирают аренду, выполняют миссии и конфликтуют за территории.</p>
            </section>
        `;
    }

    function loadNewGame() {
        mainContent.innerHTML = `
            <section id="new-game">
                <h2>Создание новой игры</h2>
                <form id="game-setup">
                    <label for="players">Количество игроков (2-6):</label>
                    <input type="number" id="players" min="2" max="6" value="4">
                    <button type="submit">Начать игру</button>
                </form>
                <div id="role-selection" style="display: none;">
                    <h3>Выберите роли</h3>
                    <div id="roles-list"></div>
                    <button id="start-game-btn">Запустить игру</button>
                </div>
            </section>
        `;

        const form = document.getElementById('game-setup');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const players = parseInt(document.getElementById('players').value);
            showRoleSelection(players);
        });
    }

    function showRoleSelection(players) {
        const roles = ['ХАКЕР', 'КОРПОРАТ', 'НОМАД', 'ИНЖЕНЕР', 'АГЕНТ КБ', 'КИБЕР-ЖРЕЦ'];
        const rolesList = document.getElementById('roles-list');
        rolesList.innerHTML = '';
        for (let i = 0; i < players; i++) {
            const select = document.createElement('select');
            select.id = `player-${i}`;
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                select.appendChild(option);
            });
            rolesList.appendChild(document.createElement('label')).textContent = `Игрок ${i+1}: `;
            rolesList.appendChild(select);
            rolesList.appendChild(document.createElement('br'));
        }
        document.getElementById('role-selection').style.display = 'block';

        document.getElementById('start-game-btn').addEventListener('click', () => {
            // Здесь будет логика запуска игры
            showNotification('Игра запущена! Добро пожаловать в КИБЕРПОЛИС!', 'success');
        });
    }

    function loadGameBoard() {
        mainContent.innerHTML = `
            <section id="game-board">
                <h2>Игровое поле</h2>
                <div id="board-container">
                    <div id="board">
                        <!-- Ячейки поля -->
                        <div class="cell corner"><span>СТАРТ</span></div>
                        <div class="cell region-top"><span>Центр связи</span></div>
                        <div class="cell region-top"><span>Техно-рынок</span></div>
                        <div class="cell region-top"><span>Кибербар</span></div>
                        <div class="cell region-top"><span>Мастерская дронов</span></div>
                        <div class="cell region-top"><span>Транслятор</span></div>
                        <div class="cell corner"><span>АНОМАЛИЯ</span></div>

                        <div class="cell region-left"><span>Чёрный рынок</span></div>
                        <div class="cell region-left"><span>Подполье</span></div>
                        <div class="cell region-left"><span>Ночной клуб</span></div>
                        <div class="cell region-left"><span>Генный банк</span></div>
                        <div class="cell region-left"><span>Энергоблок</span></div>

                        <div class="center">
                            <h1>КИБЕРПОЛИС</h1>
                            <p>Город, где нет друзей — есть ресурсы</p>
                        </div>

                        <div class="cell region-right"><span>Сеть хакеров</span></div>
                        <div class="cell region-right"><span>Убежище</span></div>
                        <div class="cell region-right"><span>Фабрика синт-органов</span></div>
                        <div class="cell region-right"><span>Лаборатория ИИ</span></div>
                        <div class="cell region-right"><span>Завод корпорации</span></div>

                        <div class="cell corner"><span>СЕКРЕТНАЯ МИССИЯ</span></div>
                        <div class="cell region-bottom"><span>Пригород</span></div>
                        <div class="cell region-bottom"><span>Заброшенная станция</span></div>
                        <div class="cell region-bottom"><span>Пустошь</span></div>
                        <div class="cell region-bottom"><span>Караван</span></div>
                        <div class="cell region-bottom"><span>Станция топлива</span></div>
                        <div class="cell corner"><span>СЛУЧАЙ</span></div>
                    </div>
                    <div id="dice-container">
                        <div id="dice1" class="dice">?</div>
                        <div id="dice2" class="dice">?</div>
                    </div>
                </div>
                <div id="player-info">
                    <h3>Информация игрока</h3>
                    <p>Кредиты: <span id="credits">10</span></p>
                    <p>Данные: <span id="data">5</span></p>
                    <p>Карты власти: <span id="power">3</span></p>
                    <p>Очки влияния: <span id="influence">0</span></p>
                    <button id="roll-dice">Бросить кубики</button>
                    <button id="buy-district">Купить район</button>
                    <button id="upgrade-district">Модернизировать</button>
                    <button id="start-conflict">Начать конфликт</button>
                </div>
                <div id="missions">
                    <h3>Миссии</h3>
                    <ul id="missions-list">
                        <li>Собери 5 Кредитов и 3 Данные</li>
                        <li>Захвати 3 района в одном секторе</li>
                        <li>Выиграй 2 конфликта подряд</li>
                    </ul>
                    <button id="complete-mission">Выполнить миссию</button>
                </div>
            </section>
        `;

        // Создание фишек игроков
        const board = document.getElementById('board');
        const players = 4; // Предполагаем 4 игрока для примера
        for (let i = 0; i < players; i++) {
            const piece = document.createElement('div');
            piece.className = 'player-piece';
            piece.id = `player-${i}`;
            piece.style.backgroundColor = ['red', 'blue', 'green', 'yellow'][i];
            piece.dataset.position = 0; // Стартовое положение
            board.appendChild(piece);
        }
        updatePlayerPositions();

        // Бросок кубика
        document.getElementById('roll-dice').addEventListener('click', rollDice);
        document.getElementById('buy-district').addEventListener('click', buyDistrict);
        document.getElementById('upgrade-district').addEventListener('click', upgradeDistrict);
        document.getElementById('start-conflict').addEventListener('click', startConflict);
        document.getElementById('complete-mission').addEventListener('click', completeMission);
    }

    let selectedDistrict = null;
    let playerResources = { credits: 10, data: 5, power: 3, influence: 0 };
    let currentPlayer = 0; // Текущий игрок
    let playerPositions = [0, 0, 0, 0]; // Позиции игроков

    function selectDistrict(index) {
        selectedDistrict = index;
        const districts = document.querySelectorAll('.district');
        districts.forEach(d => d.classList.remove('selected'));
        districts[index].classList.add('selected');
    }

    function rollDice() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;

        // Анимация броска кубика
        animateDiceRoll(dice1, dice2);

        // Движение фишки
        setTimeout(() => {
            movePlayer(total);
            const message = `Кубики: ${dice1} + ${dice2} = ${total}. Двигайтесь на ${total} клеток.`;
            showNotification(message, 'info');
            updateResources();
        }, 2000); // Задержка после анимации кубика
    }

    function animateDiceRoll(dice1, dice2) {
        const dice1El = document.getElementById('dice1');
        const dice2El = document.getElementById('dice2');

        // Анимация тряски
        dice1El.classList.add('rolling');
        dice2El.classList.add('rolling');

        // Показываем случайные числа во время анимации
        let count = 0;
        const interval = setInterval(() => {
            dice1El.textContent = Math.floor(Math.random() * 6) + 1;
            dice2El.textContent = Math.floor(Math.random() * 6) + 1;
            count++;
            if (count >= 10) {
                clearInterval(interval);
                dice1El.textContent = dice1;
                dice2El.textContent = dice2;
                dice1El.classList.remove('rolling');
                dice2El.classList.remove('rolling');
            }
        }, 100);
    }

    function movePlayer(steps) {
        const oldPosition = playerPositions[currentPlayer];
        const newPosition = (oldPosition + steps) % 24;
        playerPositions[currentPlayer] = newPosition;

        // Анимация движения
        animatePlayerMovement(currentPlayer, oldPosition, newPosition);

        // Переход к следующему игроку
        currentPlayer = (currentPlayer + 1) % 4;
    }

    function animatePlayerMovement(playerIndex, from, to) {
        const piece = document.getElementById(`player-${playerIndex}`);
        piece.classList.add('moving');

        // Плавное движение по ячейкам
        let stepsDone = 0;
        const totalSteps = to - from;
        const interval = setInterval(() => {
            playerPositions[playerIndex] = (from + stepsDone + 1) % 24;
            placeToken(piece, playerPositions[playerIndex], playerIndex);
            stepsDone++;
            if (stepsDone >= totalSteps) {
                clearInterval(interval);
                piece.classList.remove('moving');
            }
        }, 500);
    }

    function updatePlayerPositions() {
        const players = document.querySelectorAll('.player-piece');
        const boardPath = getBoardPath();
        players.forEach((piece, index) => {
            const position = playerPositions[index];
            placeToken(piece, position, index);
        });
    }

    function getBoardPath() {
        const cells = Array.from(document.querySelectorAll(".cell"));
        const top = cells.slice(0, 7);
        const right = [cells[13], cells[14], cells[15], cells[16], cells[17]];
        const bottom = cells.slice(18, 25).reverse();
        const left = [cells[12], cells[11], cells[10], cells[9], cells[8]];
        return [...top, ...right, ...bottom, ...left];
    }

    function placeToken(token, cellIndex, offsetIndex = 0) {
        const boardPath = getBoardPath();
        const cell = boardPath[cellIndex];
        const rect = cell.getBoundingClientRect();
        const bRect = document.getElementById('board').getBoundingClientRect();
        const offset = offsetIndex * 30;
        token.style.left = `${rect.left - bRect.left + 15 + offset}px`;
        token.style.top = `${rect.top - bRect.top + 15 + offset}px`;
    }

    function buyDistrict() {
        if (selectedDistrict !== null && playerResources.credits >= 5) {
            playerResources.credits -= 5;
            showNotification('Район куплен!', 'success');
            updateResources();
        } else {
            showNotification('Недостаточно кредитов или район не выбран.', 'error');
        }
    }

    function upgradeDistrict() {
        if (selectedDistrict !== null && playerResources.data >= 2) {
            playerResources.data -= 2;
            showNotification('Район модернизирован!', 'success');
            updateResources();
        } else {
            showNotification('Недостаточно данных или район не выбран.', 'error');
        }
    }

    function startConflict() {
        if (selectedDistrict !== null && playerResources.power >= 1) {
            playerResources.power -= 1;
            const win = Math.random() > 0.5;
            if (win) {
                showNotification('Конфликт выигран! Район захвачен.', 'success');
                playerResources.influence += 1;
            } else {
                showNotification('Конфликт проигран.', 'warning');
            }
            updateResources();
        } else {
            showNotification('Недостаточно карт власти или район не выбран.', 'error');
        }
    }

    function completeMission() {
        playerResources.influence += 3;
        showNotification('Миссия выполнена! +3 Очков влияния.', 'success');
        updateResources();
    }

    function updateResources() {
        document.getElementById('credits').textContent = playerResources.credits;
        document.getElementById('data').textContent = playerResources.data;
        document.getElementById('power').textContent = playerResources.power;
        document.getElementById('influence').textContent = playerResources.influence;
    }

    function showNotification(message, type = 'info') {
        // Удаляем предыдущее уведомление
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: #000;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        `;

        // Цвета в зависимости от типа
        switch (type) {
            case 'success':
                notification.style.background = '#00ffff';
                notification.style.boxShadow = '0 0 20px #00ffff';
                break;
            case 'error':
                notification.style.background = '#ff0040';
                notification.style.boxShadow = '0 0 20px #ff0040';
                break;
            case 'warning':
                notification.style.background = '#ffff00';
                notification.style.boxShadow = '0 0 20px #ffff00';
                notification.style.color = '#000';
                break;
            default:
                notification.style.background = '#00ffff';
                notification.style.boxShadow = '0 0 20px #00ffff';
        }

        document.body.appendChild(notification);

        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
});