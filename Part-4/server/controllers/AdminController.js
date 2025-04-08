const {generateToken} = require('../middleware/generateToken')
// יצירת דירה חדשה

exports.LoginAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log(process.env.EMAIL,process.env.PASSWORD)
    if (email == process.env.EMAIL && password == process.env.PASSWORD)
        try {
            const token = generateToken(email, "admin")
            res.status(200).send(token)
        }
        catch (e) {
            console.log(e)
            res.send(e)
        }
    else{
        return res.status(404).json({ status: 'error', message: 'email or passord not correct' });
    }
};