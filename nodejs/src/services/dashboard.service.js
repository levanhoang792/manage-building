const dbConfig = require('@config/database');

class DashboardService {
    constructor() {
        this.pool = dbConfig;
    }

    /**
     * Lấy thống kê cơ bản
     */
    async getBasicStats() {
        const [rows] = await this.pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM buildings) as total_buildings,
                (SELECT COUNT(*) FROM floors) as total_floors,
                (SELECT COUNT(*) FROM doors) as total_doors,
                (SELECT COUNT(*) FROM users) as total_users
        `);
        return rows[0];
    }

    /**
     * Lấy thống kê trạng thái cửa
     */
    async getDoorStatusStats() {
        const [rows] = await this.pool.query(`
            SELECT 
                lock_status,
                COUNT(*) as count
            FROM doors
            GROUP BY lock_status
        `);
        return rows.map(row => ({
            lock_status: row.lock_status,
            count: parseInt(row.count)
        }));
    }

    /**
     * Lấy thống kê trạng thái cửa theo tòa nhà
     */
    async getDoorStatusByBuilding() {
        const [rows] = await this.pool.query(`
            SELECT 
                b.id as building_id,
                b.name as building_name,
                d.lock_status,
                COUNT(*) as count
            FROM buildings b
            LEFT JOIN floors f ON b.id = f.building_id
            LEFT JOIN doors d ON f.id = d.floor_id
            GROUP BY b.id, b.name, d.lock_status
            ORDER BY b.id, d.lock_status
        `);
        return rows.map(row => ({
            building_id: row.building_id,
            building_name: row.building_name,
            lock_status: row.lock_status,
            count: parseInt(row.count)
        }));
    }

    /**
     * Lấy thống kê hoạt động cửa trong 7 ngày gần nhất
     */
    async getWeeklyDoorActivity() {
        const [rows] = await this.pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_requests,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests
            FROM door_requests
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);
        return rows.map(row => ({
            date: row.date,
            total_requests: parseInt(row.total_requests),
            approved_requests: parseInt(row.approved_requests)
        }));
    }

    /**
     * Lấy thống kê hoạt động theo giờ trong ngày
     */
    async getHourlyActivity() {
        const [rows] = await this.pool.query(`
            SELECT 
                HOUR(created_at) as hour,
                COUNT(*) as total_requests,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests
            FROM door_requests
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY HOUR(created_at)
            ORDER BY hour ASC
        `);
        return rows.map(row => ({
            hour: row.hour,
            total_requests: parseInt(row.total_requests),
            approved_requests: parseInt(row.approved_requests)
        }));
    }

    /**
     * Lấy thống kê top tòa nhà có nhiều request nhất
     */
    async getTopActiveBuildings() {
        const [rows] = await this.pool.query(`
            SELECT 
                b.id as building_id,
                b.name as building_name,
                COUNT(dr.id) as total_requests,
                COUNT(DISTINCT d.id) as total_doors
            FROM buildings b
            LEFT JOIN floors f ON b.id = f.building_id
            LEFT JOIN doors d ON f.id = d.floor_id
            LEFT JOIN door_requests dr ON d.id = dr.door_id
            WHERE dr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY b.id, b.name
            ORDER BY total_requests DESC
            LIMIT 5
        `);
        return rows.map(row => ({
            building_id: row.building_id,
            building_name: row.building_name,
            total_requests: parseInt(row.total_requests),
            total_doors: parseInt(row.total_doors)
        }));
    }

    /**
     * Lấy thống kê tỷ lệ chấp nhận/từ chối theo tòa nhà
     */
    async getBuildingApprovalRates() {
        const [rows] = await this.pool.query(`
            SELECT 
                b.id as building_id,
                b.name as building_name,
                COUNT(dr.id) as total_requests,
                SUM(CASE WHEN dr.status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
                SUM(CASE WHEN dr.status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests
            FROM buildings b
            LEFT JOIN floors f ON b.id = f.building_id
            LEFT JOIN doors d ON f.id = d.floor_id
            LEFT JOIN door_requests dr ON d.id = dr.door_id
            WHERE dr.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY b.id, b.name
            HAVING total_requests > 0
            ORDER BY total_requests DESC
        `);
        return rows.map(row => ({
            building_id: row.building_id,
            building_name: row.building_name,
            total_requests: parseInt(row.total_requests),
            approved_requests: parseInt(row.approved_requests),
            rejected_requests: parseInt(row.rejected_requests),
            approval_rate: (parseInt(row.approved_requests) / parseInt(row.total_requests) * 100).toFixed(2)
        }));
    }

    /**
     * Lấy thống kê trạng thái cửa theo tầng của một tòa nhà
     */
    async getDoorStatusByFloor(buildingId) {
        const [rows] = await this.pool.query(`
            SELECT 
                f.id as floor_id,
                f.name as floor_name,
                f.floor_number,
                d.lock_status,
                COUNT(*) as count
            FROM floors f
            LEFT JOIN doors d ON f.id = d.floor_id
            WHERE f.building_id = ?
            GROUP BY f.id, f.name, f.floor_number, d.lock_status
            ORDER BY f.floor_number ASC, d.lock_status
        `, [buildingId]);
        return rows.map(row => ({
            floor_id: row.floor_id,
            floor_name: row.floor_name,
            floor_number: row.floor_number,
            lock_status: row.lock_status,
            count: parseInt(row.count)
        }));
    }
}

module.exports = new DashboardService(); 