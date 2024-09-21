import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: any, @Res() res: Response) {
    const token = await this.authService.login(user);

    // Set the JWT as a cookie
    res.cookie('jwt', token, {
      httpOnly: true, // HTTP-only prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // Ensure secure flag in production
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    return res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }

  @Post('register')
  async register(@Body() user: any) {
    return this.authService.register(user);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
}
