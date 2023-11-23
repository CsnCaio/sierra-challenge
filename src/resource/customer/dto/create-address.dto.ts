import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  zip: string;

  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 123 })
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @ApiProperty({ example: 'New York' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Wall Street' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'USA' })
  @IsNotEmpty()
  @IsString()
  country: string;
}
