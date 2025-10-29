import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const user = await auth();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user with their profile and other related data
        const userWithData = await db.user.findUnique({
            where: { id: user.id },
            include: {
                profile: true,
                nutritionProfile: true,
                achievements: true
            }
        });

        if (!userWithData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove sensitive data
        const { password, ...userWithoutPassword } = userWithData;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}