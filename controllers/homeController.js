const { PrismaClient } = require('@prisma/client');
const Redis = require("ioredis");
const redis = new Redis();

module.exports.getHomeProducts = (req, res)=> {
    return res.json(req.user);
};

module.exports.test = (req, res)=> {
    return res.send('dfdsfdsf');
};