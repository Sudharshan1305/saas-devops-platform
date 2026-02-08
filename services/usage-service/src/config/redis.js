const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
    try {
        // For local development without Redis, we'll use in-memory fallback
        if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
            redisClient = createClient({
                url: process.env.REDIS_URL,
            });

            redisClient.on('error', (err) => {
                console.error('❌ Redis Client Error:', err);
            });

            await redisClient.connect();
            console.log('✅ Redis Connected');
        } else {
            console.log('⚠️  Redis not configured - using in-memory storage');
        }
    } catch (error) {
        console.error('❌ Redis Connection Error:', error.message);
        console.log('⚠️  Continuing without Redis - using in-memory storage');
    }
};

// In-memory fallback storage
const inMemoryStore = new Map();

// Wrapper functions that work with or without Redis
const getRedis = async (key) => {
    if (redisClient && redisClient.isOpen) {
        return await redisClient.get(key);
    }
    return inMemoryStore.get(key);
};

const setRedis = async (key, value, options = {}) => {
    if (redisClient && redisClient.isOpen) {
        if (options.EX) {
            return await redisClient.setEx(key, options.EX, value);
        }
        return await redisClient.set(key, value);
    }
    inMemoryStore.set(key, value);
    if (options.EX) {
        setTimeout(() => inMemoryStore.delete(key), options.EX * 1000);
    }
    return 'OK';
};

const incrRedis = async (key) => {
    if (redisClient && redisClient.isOpen) {
        return await redisClient.incr(key);
    }
    const current = parseInt(inMemoryStore.get(key) || '0');
    const newValue = current + 1;
    inMemoryStore.set(key, newValue.toString());
    return newValue;
};

const expireRedis = async (key, seconds) => {
    if (redisClient && redisClient.isOpen) {
        return await redisClient.expire(key, seconds);
    }
    setTimeout(() => inMemoryStore.delete(key), seconds * 1000);
    return 1;
};

module.exports = {
    connectRedis,
    getRedis,
    setRedis,
    incrRedis,
    expireRedis,
};