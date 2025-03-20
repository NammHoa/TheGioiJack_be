const OrderModel = require("../models/OrderProduct");

const calculateRevenue = async (filter) => {
    let startDate, endDate;

    const now = new Date();
    if (filter === "day") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (filter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filter === "year") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
    }

    const revenue = await OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                status: "completed", 
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 },
            },
        },
    ]);

    return revenue[0] || { totalRevenue: 0, totalOrders: 0 };
};

module.exports = { calculateRevenue };
