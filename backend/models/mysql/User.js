const { pool } = require('../../config/database');

class User {
    // Найти пользователя по критериям
    static async findOne(criteria) {
        try {
            let query = 'SELECT * FROM users WHERE ';
            const params = [];
            
            if (criteria.login) {
                query += 'login = ?';
                params.push(criteria.login);
            } else if (criteria.id) {
                query += 'id = ?';
                params.push(criteria.id);
            }
            
            const [rows] = await pool.execute(query, params);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Ошибка при поиске пользователя:', error);
            throw error;
        }
    }
    
    // Найти пользователя по ID
    static async findById(id) {
        try {
            return await this.findOne({ id });
        } catch (error) {
            console.error('Ошибка при поиске пользователя по ID:', error);
            throw error;
        }
    }
    
    // Найти пользователя по логину
    static async findByLogin(login) {
        try {
            return await this.findOne({ login });
        } catch (error) {
            console.error('Ошибка при поиске пользователя по логину:', error);
            throw error;
        }
    }
    
    // Создать нового пользователя
    static async create(userData) {
        try {
            const { login, password, role_id } = userData;
            const [result] = await pool.execute(
                'INSERT INTO users (login, password, role_id) VALUES (?, ?, ?)',
                [login, password, role_id || 1]
            );
            
            return {
                id: result.insertId,
                login,
                role_id: role_id || 1
            };
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    }
    
    // Получить всех пользователей
    static async findAll() {
        try {
            const [rows] = await pool.execute('SELECT id, login, role_id FROM users');
            return rows;
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            throw error;
        }
    }
}

module.exports = User;