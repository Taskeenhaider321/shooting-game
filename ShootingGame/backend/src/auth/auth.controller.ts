import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/signup")
  signUp(@Body() signUpDto:SignUpDto) {
    console.log(signUpDto);
    
    return this.authService.signUp(signUpDto);
  }
  @Post("/login")
  logIn(@Body() logInDto:LogInDto) {
    return this.authService.logIn(logInDto);
  }
}