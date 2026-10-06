import { testMongoDB } from './mongodb';

testMongoDB().catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
});