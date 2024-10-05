import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    }
    // Remove the password key if Redis doesn't require authentication
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export default client;