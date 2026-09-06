const register = async (req, res) => {
    res.status(201).json({
        success: true,
        message: "Registration endpoint is working"
    });
};

const login = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login endpoint is working"
    });
};

module.exports = {
    register,
    login
};