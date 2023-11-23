import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateAddressDto } from "./create-address.dto";

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2023-11-22' })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'test@sierra.studio' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
