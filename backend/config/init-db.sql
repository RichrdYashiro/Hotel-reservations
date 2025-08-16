-- Создание базы данных
CREATE DATABASE IF NOT EXISTS hotel_reservations;
USE hotel_reservations;

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 1
);

-- Создание таблицы комнат
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    img VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    reservation VARCHAR(36) DEFAULT NULL
);

-- Создание таблицы бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomId VARCHAR(36) NOT NULL,
    userId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (roomId) REFERENCES rooms(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Создание таблицы игр
CREATE TABLE IF NOT EXISTS games (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    currentPrice DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2) NOT NULL,
    discount INT DEFAULT 0,
    currency VARCHAR(10) DEFAULT '₽',
    platform VARCHAR(50),
    rating DECIMAL(3, 1),
    reservation INT DEFAULT NULL,
    description TEXT,
    discountEndDate DATE DEFAULT NULL,
    maxDiscount INT DEFAULT 0,
    maxDiscountDate DATE DEFAULT NULL
);

-- Создание таблицы истории цен
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Создание таблицы сессий
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);