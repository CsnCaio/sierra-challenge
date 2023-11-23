import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Jwt, jwtPayload } from '../auth/decorators/get-jwt.decorator';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Customer successfully created' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.customerService.create(createCustomerDto, jwt.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Customers successfully listed' })
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Customer successfully listed' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Customers successfully updated' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Jwt() jwt: jwtPayload
  ) {
    return this.customerService.update(+id, updateCustomerDto, jwt.id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Customers successfully deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Distance between Customer and Warehouse successfully calculated'
  })
  @Get(':id/warehouse-distance/:warehouseId')
  getWarehouseDistance(
    @Param('id') id: string,
    @Param('warehouseId') warehouseId: string
  ) {
    return this.customerService.getWarehouseDistance(+id, +warehouseId);
  }
}
