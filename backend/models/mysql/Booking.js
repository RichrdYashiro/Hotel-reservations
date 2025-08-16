const { pool } = require('../../config/database');

class Booking {
    // Найти бронирование по ID комнаты
    static async findOne(criteria) {
        try {
            let query = 'SELECT * FROM bookings WHERE ';
            const params = [];
            
            if (criteria.roomId) {
                query += 'roomId = ?';
                params.push(criteria.roomId);
            } else if (criteria.id) {
                query += 'id = ?';
                params.push(criteria.id);
            } else if (criteria.userId) {
                query += 'userId = ?';
                params.push(criteria.userId);
            }
            
            const [rows] = await pool.execute(query, params);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Ошибка при поиске бронирования:', error);
            throw error;
        }
    }
    
    // Создать новое бронирование
    static async create(bookingData) {
        try {
            const { roomId, userId } = bookingData;
            
            const [result] = await pool.execute(
                'INSERT INTO bookings (roomId, userId) VALUES (?, ?)',
                [roomId, userId]
            );
            
            return {
                id: result.insertId,
                roomId,
                userId,
                created_at: new Date()
            };
        } catch (error) {
            console.error('Ошибка при создании бронирования:', error);
            throw error;
        }
    }
    
    // Удалить бронирование
    static async findOneAndDelete(criteria) {
        try {
            const booking = await this.findOne(criteria);
            
            if (!booking) {
                return null;
            }
            
            await pool.execute('DELETE FROM bookings WHERE roomId = ?', [criteria.roomId]);
            
            return booking;
        } catch (error) {
            console.error('Ошибка при удалении бронирования:', error);
            throw error;
        }
    }
    
    // Получить все бронирования пользователя
    static async findByUserId(userId) {
        try {
            const [rows] = await pool.execute(
                `SELECT b.*, r.title, r.img, r.price 
                FROM bookings b 
                JOIN rooms r ON b.roomId = r.id 
                WHERE b.userId = ?`,
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Ошибка при получении бронирований пользователя:', error);
            throw error;
        }
    }
}

module.exports = Booking;