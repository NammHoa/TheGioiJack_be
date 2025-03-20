const RevenueService = require("../services/RevenueService");

const getRevenue = async (req, res) => {
    try {
        const { filter } = req.query; 
        const revenueData = await RevenueService.calculateRevenue(filter);
        res.status(200).json(revenueData);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu doanh thu", error });
    }
};

module.exports = { getRevenue };
