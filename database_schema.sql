-- Схема базы данных для игры "Киберполис"
-- PostgreSQL 18

-- Таблица ролей
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    special_ability TEXT
);

-- Таблица игроков (для сохранения профилей)
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    color VARCHAR(7) NOT NULL, -- HEX цвет, например #00f0ff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица районов на доске
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'corner', 'top', 'right', 'bottom', 'left', 'center'
    position INTEGER NOT NULL, -- позиция на доске (0-23)
    cost INTEGER DEFAULT 0, -- стоимость покупки
    rent_base INTEGER DEFAULT 0, -- базовая аренда
    description TEXT
);

-- Таблица игровых сессий
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'finished', 'paused'
    current_player_id INTEGER REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    winner_id INTEGER REFERENCES players(id)
);

-- Таблица участников игры
CREATE TABLE game_players (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0, -- текущая позиция на доске
    credits INTEGER DEFAULT 1000,
    districts_owned INTEGER DEFAULT 0,
    influence INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, player_id)
);

-- Таблица владения районами
CREATE TABLE owned_districts (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    owned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, district_id)
);

-- Таблица истории ходов (для логов)
CREATE TABLE game_moves (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    move_type VARCHAR(50) NOT NULL, -- 'roll_dice', 'buy_district', 'pay_rent', etc.
    details JSONB, -- дополнительные данные о ходе
    move_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_game_players_game_id ON game_players(game_id);
CREATE INDEX idx_owned_districts_game_id ON owned_districts(game_id);
CREATE INDEX idx_game_moves_game_id ON game_moves(game_id);

-- Вставка начальных данных ролей
INSERT INTO roles (name, description, special_ability) VALUES
('Хакер', 'Мастер цифровых взломов', 'Может красть кредиты у других игроков'),
('Корпорат', 'Представитель большой корпорации', 'Получает бонус к доходам от районов'),
('Кибернетик', 'Эксперт по имплантам', 'Может улучшать свои способности'),
('Торговец', 'Торгует ресурсами на черном рынке', 'Скидки на покупку районов'),
('Бандит', 'Контролирует подполье', 'Может захватывать районы силой'),
('Информатор', 'Собирает информацию', 'Видит скрытые ресурсы других игроков');

-- Вставка начальных данных районов
INSERT INTO districts (name, type, position, cost, rent_base, description) VALUES
('СТАРТ', 'corner', 0, 0, 0, 'Начальная точка'),
('Центр связи', 'top', 1, 200, 20, 'Связь и коммуникации'),
('Техно-рынок', 'top', 2, 250, 25, 'Торговля технологиями'),
('Кибербар', 'top', 3, 300, 30, 'Развлечения и отдых'),
('Мастерская дронов', 'top', 4, 350, 35, 'Производство дронов'),
('Транслятор', 'top', 5, 400, 40, 'Медиа и пропаганда'),
('АНОМАЛИЯ', 'corner', 6, 0, 0, 'Случайное событие'),
('Чёрный рынок', 'left', 7, 450, 45, 'Нелегальная торговля'),
('Подполье', 'left', 8, 500, 50, 'Скрытые операции'),
('Ночной клуб', 'left', 9, 550, 55, 'Развлечения'),
('Генный банк', 'left', 10, 600, 60, 'Биотехнологии'),
('Энергоблок', 'left', 11, 650, 65, 'Энергетика'),
('КИБЕРПОЛИС', 'center', 12, 0, 0, 'Центральный район'),
('Сеть хакеров', 'right', 13, 700, 70, 'Кибербезопасность'),
('Убежище', 'right', 14, 750, 75, 'Защита'),
('Фабрика синт-органов', 'right', 15, 800, 80, 'Медицина'),
('Лаборатория ИИ', 'right', 16, 850, 85, 'Искусственный интеллект'),
('Завод корпорации', 'right', 17, 900, 90, 'Производство'),
('СЕКРЕТНАЯ МИССИЯ', 'corner', 18, 0, 0, 'Специальное задание'),
('Пригород', 'bottom', 19, 950, 95, 'Жилые районы'),
('Заброшенная станция', 'bottom', 20, 1000, 100, 'Промышленность'),
('Пустошь', 'bottom', 21, 1050, 105, 'Необитаемая зона'),
('Караван', 'bottom', 22, 1100, 110, 'Торговля'),
('Станция топлива', 'bottom', 23, 1150, 115, 'Энергетика'),
('СЛУЧАЙ', 'corner', 24, 0, 0, 'Случайное событие');