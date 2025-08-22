import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const demoProfiles = [
      {
        email: 'admin@matrimony.com',
        password: 'admin123',
        name: 'Admin User',
        age: 35,
        gender: 'male',
        role: 'admin',
        bio: 'Platform administrator. Loves technology and management.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/men/1.jpg',
            'https://randomuser.me/api/portraits/men/2.jpg'
          ],
          religion: 'Hindu',
          caste: 'Other',
          location: 'Mumbai, Maharashtra',
          occupation: 'Admin',
          education: 'MBA'
        }
      },
      {
        email: 'jane.doe@example.com',
        password: 'password123',
        name: 'Jane Doe',
        age: 28,
        gender: 'female',
        role: 'user',
        bio: 'Marketing specialist who enjoys hiking and painting. Looking for a supportive partner.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/women/44.jpg',
            'https://randomuser.me/api/portraits/women/45.jpg'
          ],
          religion: 'Christian',
          caste: 'Catholic',
          location: 'Bangalore, Karnataka',
          occupation: 'Marketing Specialist',
          education: 'MBA Marketing'
        }
      },
      {
        email: 'mohammad.ali@example.com',
        password: 'password123',
        name: 'Mohammad Ali',
        age: 31,
        gender: 'male',
        role: 'user',
        bio: 'Engineer and football fan. Enjoys traveling and reading history.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/men/33.jpg',
            'https://randomuser.me/api/portraits/men/34.jpg'
          ],
          religion: 'Muslim',
          caste: 'Sunni',
          location: 'Delhi, NCR',
          occupation: 'Civil Engineer',
          education: 'B.Tech Civil'
        }
      },
      {
        email: 'sara.kapoor@example.com',
        password: 'password123',
        name: 'Sara Kapoor',
        age: 26,
        gender: 'female',
        role: 'user',
        bio: 'Fashion designer who loves art, music, and travel. Looking for a creative partner.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/women/68.jpg',
            'https://randomuser.me/api/portraits/women/69.jpg'
          ],
          religion: 'Hindu',
          caste: 'Khatri',
          location: 'Chandigarh',
          occupation: 'Fashion Designer',
          education: 'B.Des Fashion'
        }
      },
      {
        email: 'arjun.mehta@example.com',
        password: 'password123',
        name: 'Arjun Mehta',
        age: 29,
        gender: 'male',
        role: 'user',
        bio: 'Entrepreneur and foodie. Enjoys running and volunteering.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/men/22.jpg',
            'https://randomuser.me/api/portraits/men/23.jpg'
          ],
          religion: 'Jain',
          caste: 'Mehta',
          location: 'Ahmedabad, Gujarat',
          occupation: 'Entrepreneur',
          education: 'MBA'
        }
      },
      {
        email: 'fatima.shaikh@example.com',
        password: 'password123',
        name: 'Fatima Shaikh',
        age: 27,
        gender: 'female',
        role: 'user',
        bio: 'Doctor who loves books and classical music. Looking for a caring partner.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/women/12.jpg',
            'https://randomuser.me/api/portraits/women/13.jpg'
          ],
          religion: 'Muslim',
          caste: 'Shaikh',
          location: 'Hyderabad, Telangana',
          occupation: 'Doctor',
          education: 'MBBS'
        }
      },
      {
        email: 'rohan.singh@example.com',
        password: 'password123',
        name: 'Rohan Singh',
        age: 32,
        gender: 'male',
        role: 'user',
        bio: 'Fitness trainer and adventure lover. Enjoys hiking and healthy living.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/men/55.jpg',
            'https://randomuser.me/api/portraits/men/56.jpg'
          ],
          religion: 'Sikh',
          caste: 'Singh',
          location: 'Amritsar, Punjab',
          occupation: 'Fitness Trainer',
          education: 'B.Sc Sports Science'
        }
      },
      {
        email: 'ananya.verma@example.com',
        password: 'password123',
        name: 'Ananya Verma',
        age: 25,
        gender: 'female',
        role: 'user',
        bio: 'Software developer and avid reader. Loves coding and coffee.',
        profile: {
          photos: [
            'https://randomuser.me/api/portraits/women/21.jpg',
            'https://randomuser.me/api/portraits/women/22.jpg'
          ],
          religion: 'Hindu',
          caste: 'Verma',
          location: 'Lucknow, UP',
          occupation: 'Software Developer',
          education: 'B.Tech IT'
        }
      }
    ];

    const createdProfiles = [];

    for (const profileData of demoProfiles) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: profileData.email }
      });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(profileData.password, 12);

        // Create user
        const user = await prisma.user.create({
          data: {
            name: profileData.name,
            email: profileData.email,
            password: hashedPassword,
            age: profileData.age,
            gender: profileData.gender,
            bio: profileData.bio,
            role: profileData.role || 'user'
          }
        });

        // Create profile
        await prisma.profile.create({
          data: {
            userId: user.id,
            photos: profileData.profile.photos,
            religion: profileData.profile.religion,
            caste: profileData.profile.caste,
            location: profileData.profile.location,
            occupation: profileData.profile.occupation,
            education: profileData.profile.education
          }
        });

        createdProfiles.push(user);
      }
    }

    return NextResponse.json({ 
      message: 'Demo profiles created successfully',
      count: createdProfiles.length,
      profiles: createdProfiles
    });

  } catch (error) {
    console.error('Error creating demo profiles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
