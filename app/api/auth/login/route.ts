import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../../lib/auth';
import { serialize } from 'cookie';

const usersPath = path.join(process.cwd(), 'db', 'users.json');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });

    const raw = readFileSync(usersPath, 'utf8') || '[]';
    const users = JSON.parse(raw);
    const user = users.find((u: any) => u.email === email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ sub: user.id, email: user.email });
    const cookie = serialize('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { headers: { 'Set-Cookie': cookie } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
