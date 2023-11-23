import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;
}
