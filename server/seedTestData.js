const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Project = require('./models/Project');

const seedTestData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Clear existing test data
        await User.deleteMany({ email: { $regex: /@test\.com$/ } });
        await User.deleteMany({ email: { $regex: /^testuser/ } });
        await Project.deleteMany({ title: { $regex: /^(Test Project|Existing Test Project)/ } });
        console.log('🧹 Cleared existing test data');

        // Hash password
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Create test users
        const testUsers = [
            {
                buid: 'STU001',
                email: 'student@test.com',
                password: hashedPassword,
                role: 'student',
                profile: {
                    fullName: 'Test Student',
                    department: 'Computer Science',
                    specialization: 'Software Engineering',
                    phone: '1234567890'
                }
            },
            {
                buid: 'SUP001',
                email: 'supervisor@test.com',
                password: hashedPassword,
                role: 'supervisor',
                profile: {
                    fullName: 'Test Supervisor',
                    department: 'Computer Science',
                    specialization: 'AI & Machine Learning',
                    phone: '1234567891'
                },
                availability: [
                    { day: 'Monday', slots: ['09:00-10:00', '10:00-11:00'] },
                    { day: 'Tuesday', slots: ['14:00-15:00', '15:00-16:00'] }
                ]
            },
            {
                buid: 'COORD001',
                email: 'coordinator@test.com',
                password: hashedPassword,
                role: 'coordinator',
                profile: {
                    fullName: 'Test Coordinator',
                    department: 'Computer Science',
                    specialization: 'Project Management',
                    phone: '1234567892'
                }
            },
            {
                buid: 'PAN001',
                email: 'panelist@test.com',
                password: hashedPassword,
                role: 'panelist',
                profile: {
                    fullName: 'Test Panelist',
                    department: 'Computer Science',
                    specialization: 'Database Systems',
                    phone: '1234567893'
                },
                availability: [
                    { day: 'Wednesday', slots: ['09:00-10:00', '10:00-11:00'] },
                    { day: 'Thursday', slots: ['14:00-15:00', '15:00-16:00'] }
                ]
            }
        ];

        const createdUsers = await User.insertMany(testUsers);
        console.log('✅ Created test users:', createdUsers.map(u => u.email).join(', '));

        // Get user IDs
        const student = createdUsers.find(u => u.role === 'student');
        const supervisor = createdUsers.find(u => u.role === 'supervisor');

        // Create a test project for evaluation tests
        const testProject = new Project({
            title: 'Existing Test Project',
            description: 'This is a pre-existing project for evaluation tests',
            studentId: student._id,
            supervisorId: supervisor._id,
            status: 'supervisor_endorsed',
            hasMidtermPresentation: true,
            hasFinalReport: false,
            marks: {
                supervisorLogs: 0,
                midterm: 0,
                finalViva: 0,
                total: 0
            }
        });

        await testProject.save();
        console.log('✅ Created test project for evaluations');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('   Student: student@test.com / 123456');
        console.log('   Supervisor: supervisor@test.com / 123456');
        console.log('   Coordinator: coordinator@test.com / 123456');
        console.log('   Panelist: panelist@test.com / 123456');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        console.error(error);
        process.exit(1);
    }
};

// Run seeding
seedTestData();
