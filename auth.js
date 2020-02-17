const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Redis = require("ioredis");
const redis = new Redis();


const prisma = new PrismaClient();
require('dotenv').config();


const createTokens = async (user, secretAccess, secret2) => {
    const createToken  = jwt.sign(
        {
            user: _.pick(user, ['GUID', 'email', 'role'])
        },
        secretAccess,
        { expiresIn: '1m' }
        );

    const secretRefresh = user.firstName + secret2;
    const createRefreshToken = await jwt.sign(
        {
            user: _.pick(user, ['GUID', 'email', 'role'])
        },
        secretRefresh,

        { expiresIn: '5m' }
    );
    redis.set(createRefreshToken, createRefreshToken);
    return [createToken, createRefreshToken];
};

const refreshTokens = async (refreshToken, secretAccess, secret2) => {

    let userId;
    const error = {error: 'Invalid token'};
    try{
        const { user: {GUID}} = jwt.decode(refreshToken);
        userId = GUID;
    }catch (err) {
        if(err) return error;
    }

    const user = await prisma.users.findOne({ where: { GUID: userId}});
    if(!user) return error;

    const secretRefresh = user.firstName + secret2;

    try{
        jwt.verify(refreshToken, secretRefresh);
    }catch (err) {
        return error;
    }
    const result = await redis.get(refreshToken);
    if(result!==refreshToken) {
        return error;
    }
    else {
        redis.del(refreshToken);
        const [createToken, createRefreshToken] = await createTokens(user, secretAccess, secret2);

        return {
            token: createToken,
            refreshToken: createRefreshToken,
            user: _.pick(user, ['GUID', 'email', 'role'])
        };
    }
};

const authUser = async (req, res, next) => {

    const token = req.headers['x-token'];
    if(token) {
        try{
            const {user} = jwt.verify(token, process.env.ACCESS_SECRET);
            req.user = user;
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            if(!refreshToken) return res.json({error: "Refresh token is not defined"});
            const newTokens = await refreshTokens(refreshToken, process.env.ACCESS_SECRET, process.env.REFRESH_SECRET);

            if(newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
                req.user = newTokens.user;
            }else{
                return res.json(newTokens);
            }
        }
        next();
    }else{
        return res.json({error: 'Invalid token'});
    }

};
module.exports = {
    refreshTokens,
    createTokens,
    authUser
};