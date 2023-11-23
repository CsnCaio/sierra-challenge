import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SecurityUtil } from 'src/utils/security.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await SecurityUtil.compare(signInDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
