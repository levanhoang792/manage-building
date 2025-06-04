const dashboardService = require('@/src/services/dashboard.service');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const [
                basicStats,
                doorStatusStats,
                doorStatusByBuilding,
                weeklyDoorActivity,
                hourlyActivity,
                topActiveBuildings,
                buildingApprovalRates
            ] = await Promise.all([
                dashboardService.getBasicStats(),
                dashboardService.getDoorStatusStats(),
                dashboardService.getDoorStatusByBuilding(),
                dashboardService.getWeeklyDoorActivity(),
                dashboardService.getHourlyActivity(),
                dashboardService.getTopActiveBuildings(),
                dashboardService.getBuildingApprovalRates()
            ]);

            res.json({
                success: true,
                data: {
                    basicStats,
                    doorStatusStats,
                    doorStatusByBuilding,
                    weeklyDoorActivity,
                    hourlyActivity,
                    topActiveBuildings,
                    buildingApprovalRates
                }
            });
        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard statistics',
                error: process.env.NODE_ENV === 'production' ? undefined : error.message
            });
        }
    }

    async getDoorStatusByFloor(req, res) {
        try {
            const { buildingId } = req.params;
            const stats = await dashboardService.getDoorStatusByFloor(buildingId);
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Door status by floor error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching door status by floor',
                error: process.env.NODE_ENV === 'production' ? undefined : error.message
            });
        }
    }
}

module.exports = new DashboardController(); 