import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({ example: 'test@sierra.studio' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sierra@123!' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
