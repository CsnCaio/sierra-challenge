import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'test@sierra.studio' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sierra@123!' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsBoolean()
  revoked?: boolean;
}
