import swaggerUi from 'swagger-ui-express';
import { specs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

export async function GET() {
    const html = swaggerUi.generateHTML(specs, {
        customSiteTitle: "LevelUp Life API Documentation",
        customfavIcon: "/favicon.ico"
    });

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}