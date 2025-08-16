const { pool } = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

class Room {
    // Получить все комнаты
    static async findAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM rooms');
            return rows;
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
            throw error;
        }
    }
    
    // Найти комнату по ID
    static async findOne(criteria) {
        try {
            const [rows] = await pool.execute('SELECT * FROM rooms WHERE id = ?', [criteria.id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Ошибка при поиске комнаты:', error);
            throw error;
        }
    }
    
    // Создать новую комнату
    static async create(roomData) {
        try {
            const id = roomData.id || uuidv4();
            const { title, description, img, price } = roomData;
            
            await pool.execute(
                'INSERT INTO rooms (id, title, description, img, price) VALUES (?, ?, ?, ?, ?)',
                [id, title, description || '', img || '', price]
            );
            
            return { id, title, description, img, price, reservation: null };
        } catch (error) {
            console.error('Ошибка при создании комнаты:', error);
            throw error;
        }
    }
    
    // Обновить комнату
    static async findOneAndUpdate(criteria, updateData) {
        try {
            const fields = [];
            const values = [];
            
            Object.entries(updateData).forEach(([key, value]) => {
                fields.push(`${key} = ?`);
                values.push(value);
            });
            
            values.push(criteria.id);
            
            await pool.execute(
                `UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`,
                values
            );
            
            const [rows] = await pool.execute('SELECT * FROM rooms WHERE id = ?', [criteria.id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Ошибка при обновлении комнаты:', error);
            throw error;
        }
    }
}

module.exports = Room;