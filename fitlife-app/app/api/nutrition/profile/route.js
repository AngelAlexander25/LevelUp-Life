import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Fetch user's nutrition profile
export async function GET(request) {
    try {
        const user = await auth();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const nutritionProfile = await db.nutritionProfile.findUnique({
            where: { userId: user.id }
        });

        if (!nutritionProfile) {
            return NextResponse.json({ error: 'Nutrition profile not found' }, { status: 404 });
        }

        return NextResponse.json(nutritionProfile);
    } catch (error) {
        console.error('Error fetching nutrition profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT: Update user's nutrition profile
export async function PUT(request) {
    try {
        const user = await auth();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        
        const updatedProfile = await db.nutritionProfile.upsert({
            where: { userId: user.id },
            update: {
                ...data,
                updatedAt: new Date()
            },
            create: {
                ...data,
                userId: user.id
            }
        });

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Error updating nutrition profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}