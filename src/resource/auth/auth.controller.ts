import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
