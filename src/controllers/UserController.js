const UserService = require('../services/UserServive')
const JwtService = require('../services/JwtService')

// const createUser = async (req, res) => {
//     try {
//         const { name, email, password, confirmPassword, phone } = req.body
//         const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//         const isCheckEmail = reg.test(email)
//         if (!email || !password || !confirmPassword) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Vui lòng không bỏ trống'
//             })
//         } else if (!isCheckEmail) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Vui lòng nhập đúng định dạng @gmail.com'
//             })
//         } else if (password !== confirmPassword) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Mật khẩu không trùng! vui lòng nhập lại'
//             })
//         }
//         const response = await UserService.createUser(req.body)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền email'
            });
        }
        if (!password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền mật khẩu'
            });
        }
        if (!confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền xác nhận mật khẩu'
            });
        }

        if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập đúng định dạng email (ví dụ: example@gmail.com)'
            });
        }
        if (password.length < 6 || password.length > 20) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu phải có độ dài từ 6 đến 20 ký tự'
            });
        }
        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu không trùng! Vui lòng nhập lại.'
            });
        }
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);

    } catch (e) {

        return res.status(404).json({
            status: 'ERR',
            message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
            error: e.message
        });
    }
};

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//         const isCheckEmail = reg.test(email)
//         if (!email || !password) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Đầu vào là bắt buộc'
//             })
//         } else if (!isCheckEmail) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'Đầu vào phải là email'
//             })
//         }
//         const response = await UserService.loginUser(req.body)
//         const { refresh_token, ...newReponse } = response
//         res.cookie('refresh_token', refresh_token, {
//             httpOnly: true,
//             secure: false,
//             sameSite: 'strict',
//             path: '/',
//         })
//         return res.status(200).json({ ...newReponse, refresh_token })
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền email'
            });
        }

        if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Đầu vào phải là email đúng định dạng (ví dụ: example@gmail.com)'
            });
        }

        if (!password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền mật khẩu'
            });
        }
        const response = await UserService.loginUser(req.body);

        if (!response) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Tài khoản chưa được đăng ký. Vui lòng kiểm tra lại thông tin hoặc đăng ký tài khoản.'
            });
        }


        const { refresh_token, ...newResponse } = response;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, 
            sameSite: 'strict',
            path: '/',
        });
        return res.status(200).json({ ...newResponse, refresh_token });
    } catch (e) {

        return res.status(500).json({
            status: 'ERR',
            message: 'Có lỗi xảy ra trong quá trình xử lý.',
            error: e.message
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'ID người dùng là bắt buộc'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'ID người dùng là bắt buộc'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'ID người dùng là bắt buộc'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'ID người dùng là bắt buộc'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mã thông báo là bắt buộc'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}






module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany,
    
}
