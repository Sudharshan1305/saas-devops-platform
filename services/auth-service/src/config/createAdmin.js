const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: 'admin@saas.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email: admin@saas.com');
            mongoose.connection.close();
            return;
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@saas.com',
            password: 'admin123',
            role: 'ADMIN',
        });

        console.log('✅ Admin user created successfully!');
        console.log('\n📧 Login credentials:');
        console.log('Email: admin@saas.com');
        console.log('Password: admin123');
        console.log(`\nUser ID: ${admin._id}`);

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();