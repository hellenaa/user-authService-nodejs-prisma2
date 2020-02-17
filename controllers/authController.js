const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { createTokens } = require('../auth');

require('dotenv').config();


const prisma = new PrismaClient();

module.exports.register = async (req, res) => {
    // return res.json({error: "err"});
    let error = [];
    const email = await prisma.users.findOne({ where: {email: req.body.email} });
    if (email) {
        error = "Email already exists";
        return res.json(error);
    }
    await bcrypt.hash(req.body.password, 12, async (err, hashedPassword) => {
        if(err) {
            error = "Something goes wrong, try again";
            return res.json({error: error});
        }
        const newUser = await prisma.users.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role
            }
        });
        if (!newUser) {
            error = "User doesn't create, try again";
            return res.json(error);
        }

        return res.json({user: newUser});
    });

};

module.exports.login = async (req, res) => {

    let error = [];
    const user = await prisma.users.findOne({where: {email: req.body.email}});
    if(!user) {
        error = "Email does not exists.";
        return res.json(error);
    }
    bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
        if(err) {
            error = "Something goes wrong try again";
            return res.json(error);
        }
        if(!isMatch) {
            error = "Password does not match!";
            return res.json(error);
        }
        const [token, refreshToken] = await createTokens(user, process.env.ACCESS_SECRET, process.env.REFRESH_SECRET);

        return res.json({
            status: 'OK',
            token: token,
            refreshToken: refreshToken
        });


    });
};