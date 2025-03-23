const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'Thành công'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt
                })
                if (createdOrder) {
                    // await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'Thành công',
                        data: createOrder
                    })
                }
            }
        } catch (e) {
            //   console.log('e', e)
            reject(e)
        }
    })
}


// const getAllOrderDetails = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const order = await Order.find({
//                 user: id
//             }).sort({ createdAt: -1, updatedAt: -1 })
//             if (order === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The order is not defined'
//                 })
//             }

//             resolve({
//                 status: 'OK',
//                 message: 'Thành công',
//                 data: order
//             })
//         } catch (e) {
//             // console.log('e', e)
//             reject(e)
//         }
//     })
// }
const getAllOrderDetails = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

            if (!orders.length) {
                return resolve({
                    status: 'ERR',
                    message: 'Không có đơn hàng nào',
                });
            }

            resolve({
                status: 'OK',
                message: 'Lấy danh sách đơn hàng thành công',
                data: orders.map(order => ({
                    _id: order._id,
                    orderItems: order.orderItems,
                    totalPrice: order.totalPrice,
                    status: order.status, 
                    createdAt: order.createdAt,
                })),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Thành công',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results[0] && results[0].id

            if (newData) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${newData} không tồn tại`
                })
            }
            resolve({
                status: 'OK',
                message: 'Thành công',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Thành công',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrderStatus = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validStatuses = ['Chưa giao hàng', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng'];

            if (!validStatuses.includes(status)) {
                return resolve({
                    status: 'ERR',
                    message: 'Trạng thái không hợp lệ',
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );

            if (!updatedOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy đơn hàng',
                });
            }

            resolve({
                status: 'OK',
                message: 'Cập nhật trạng thái đơn hàng thành công',
                data: updatedOrder,
            });
        } catch (e) {
            reject(e);
        }
    });
};




module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus

}