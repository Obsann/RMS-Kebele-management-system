/**
 * Seed script - creates an initial admin user if none exists
 * Run with: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/authmodel');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kebele.gov.et';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'SystemAdmin';

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.\n');

        // Check if any admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`Admin already exists: ${existingAdmin.email}`);
            console.log('Skipping seed. To create another admin, use the admin dashboard.\n');
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        const admin = await User.create({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL.toLowerCase(),
            password: hashedPassword,
            role: 'admin',
            status: 'approved',
            phone: '0911000000'
        });

        console.log('✅ Admin user created successfully!');
        console.log('─────────────────────────────────');
        console.log(`  Email:    ${admin.email}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log(`  Role:     ${admin.role}`);
        console.log(`  Status:   ${admin.status}`);
        console.log('─────────────────────────────────');
        console.log('\n⚠️  Change the default password immediately after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
