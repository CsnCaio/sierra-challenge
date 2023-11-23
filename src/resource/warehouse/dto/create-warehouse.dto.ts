import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateAddressDto } from "src/resource/customer/dto/create-address.dto";

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Warehouse 1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  currentInventory: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
