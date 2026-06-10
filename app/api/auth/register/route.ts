import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersPath = path.join(process.cwd(), 'db', 'users.json');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });

    const raw = readFileSync(usersPath, 'utf8') || '[]';
    const users = JSON.parse(raw);
    if (users.find((u: any) => u.email === email)) return NextResponse.json({ error: 'User exists' }, { status: 409 });

    const hashed = bcrypt.hashSync(password, 10);
    const user = { id: Date.now().toString(), email, password: hashed };
    users.push(user);
    writeFileSync(usersPath, JSON.stringify(users, null, 2));

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
