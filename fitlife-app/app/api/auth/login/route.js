import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find user
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ userId: user.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .setIssuedAt()
            .sign(secret);

        // Set cookie
        cookies().set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 24 hours
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}