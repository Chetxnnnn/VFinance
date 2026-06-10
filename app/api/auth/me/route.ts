import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';
import { verifyToken } from '../../../../lib/auth';
import { parse } from 'cookie';

const usersPath = path.join(process.cwd(), 'db', 'users.json');

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader || '');
    const token = cookies.token;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const payload: any = verifyToken(token);
    const users = JSON.parse(readFileSync(usersPath, 'utf8') || '[]');
    const user = users.find((u: any) => u.id === payload.sub);
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json({ authenticated: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ authenticated: false, error: String(err) }, { status: 401 });
  }
}
