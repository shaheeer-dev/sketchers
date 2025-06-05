import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/utils/PrismaClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, username, email, password } = body

    if (!fullName || !username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const existingEmailUser = await db.user.findUnique({
      where: { email }
    })

    if (existingEmailUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
    }

    const existingUsernameUser = await db.user.findUnique({
      where: { username }
    })

    if (existingUsernameUser) {
      return NextResponse.json({ message: 'Username already in use' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        fullName,
        username,
        email,
        password: hashedPassword
      }
    })

    const payload = { userId: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn']
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          uuid: user.uuid,
          fullName: user.fullName,
          username: user.username,
          email: user.email
        },
        token
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
