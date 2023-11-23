import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Jwt, jwtPayload } from '../auth/decorators/get-jwt.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Warehouse successfully created' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createWarehouseDto: CreateWarehouseDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.warehouseService.create(createWarehouseDto, jwt.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Warehouses successfully listed' })
  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Warehouse successfully listed' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Warehouse successfully updated' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.warehouseService.update(+id, updateWarehouseDto, jwt.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Warehouse successfully deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}
