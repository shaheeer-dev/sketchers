import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/utils/PrismaClient'

type LoginRequestBody = {
  identifier: string
  password: string
}

export async function POST(req: NextRequest) {
  try {
    const { identifier, password }: LoginRequestBody = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier }
        ]
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }

    const payload = { userId: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn']
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
