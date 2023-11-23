import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
