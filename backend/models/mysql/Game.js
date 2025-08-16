const { pool } = require('../../config/database');

class Game {
    // Получить все игры
    static async findAll(options = {}) {
        try {
            let query = 'SELECT * FROM games';
            const params = [];
            
            // Фильтрация по скидкам
            if (options.discounted) {
                query += ' WHERE discount > 0';
            }
            
            // Поиск по названию
            if (options.search) {
                query += options.discounted ? ' AND' : ' WHERE';
                query += ' title LIKE ?';
                params.push(`%${options.search}%`);
            }
            
            // Сортировка
            if (options.sort) {
                switch (options.sort) {
                    case 'price':
                        query += ' ORDER BY currentPrice ASC';
                        break;
                    case 'name':
                        query += ' ORDER BY title ASC';
                        break;
                    case 'discount':
                        query += ' ORDER BY discount DESC';
                        break;
                    default:
                        query += ' ORDER BY id ASC';
                }
            }
            
            // Пагинация
            if (options.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(options.limit));
                
                if (options.offset) {
                    query += ' OFFSET ?';
                    params.push(parseInt(options.offset));
                }
            }
            
            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Ошибка при получении игр:', error);
            throw error;
        }
    }
    
    // Найти игру по ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM games WHERE id = ?', [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const game = rows[0];
            
            // Получаем историю цен для игры
            const [priceHistory] = await pool.execute(
                'SELECT date, price, type FROM price_history WHERE game_id = ? ORDER BY date',
                [id]
            );
            
            return { ...game, priceHistory };
        } catch (error) {
            console.error('Ошибка при поиске игры:', error);
            throw error;
        }
    }
    
    // Обновить игру
    static async update(id, updateData) {
        try {
            const fields = [];
            const values = [];
            
            Object.entries(updateData).forEach(([key, value]) => {
                fields.push(`${key} = ?`);
                values.push(value);
            });
            
            values.push(id);
            
            await pool.execute(
                `UPDATE games SET ${fields.join(', ')} WHERE id = ?`,
                values
            );
            
            return this.findById(id);
        } catch (error) {
            console.error('Ошибка при обновлении игры:', error);
            throw error;
        }
    }
}

module.exports = Game;