import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Jwt, jwtPayload } from '../auth/decorators/get-jwt.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createWarehouseDto: CreateWarehouseDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.warehouseService.create(createWarehouseDto, jwt.id);
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.warehouseService.update(+id, updateWarehouseDto, jwt.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}
