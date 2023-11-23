import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { HttpStatus } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import { Warehouse } from 'src/database/entities/warehouse.entity';
import { Repository } from 'typeorm';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

test.group('Warehouse e2e', (group) => {
  const url = `${process.env.BASE_URL}/warehouse`;
  const jwtToken = process.env.JWT_TOKEN;

  let repo: Repository<Warehouse>;
  group.setup(() => {
    repo = dataSource.createEntityManager().getRepository(Warehouse);
  });

  let warehousePayload: CreateWarehouseDto;
  group.each.setup(async () => {
    warehousePayload = {
      name: faker.company.name(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      currentInventory: faker.number.int({ min: 1, max: 100 }),
      isActive: true,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    };
  });

  test('Should not create a new warehouse without a jwt token', async ({ assert }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(warehousePayload),
      headers: { 'Content-Type': 'application/json' }
    });

    assert.equal(response.status, HttpStatus.UNAUTHORIZED);
  });

  test('Should create a new warehouse', async ({ assert }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(warehousePayload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.CREATED);

    const warehouse = await repo.findOne({ where: { name: warehousePayload.name } });
    assert.isNotNull(warehouse);
  });

  test('Should get all warehouses', async ({ assert }) => {
    for (let i = 0; i < 10; i++) {
      await repo.save({
        name: faker.company.name(),
        capacity: faker.number.int({ min: 1, max: 100 }),
        currentInventory: faker.number.int({ min: 1, max: 100 }),
        isActive: true,
        managerId: 1,
        address: {
          zip: faker.location.zipCode(),
          city: faker.location.city(),
          number: Number(faker.location.buildingNumber()),
          state: faker.location.state(),
          street: faker.location.streetAddress(),
          country: faker.location.country(),
        }
      });
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.isArray(body);
    assert.isNotEmpty(body);
  });

  test('Should get a warehouse by id', async ({ assert }) => {
    const warehouse = await repo.save({
      name: faker.company.name(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      currentInventory: faker.number.int({ min: 1, max: 100 }),
      isActive: true,
      managerId: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${warehouse.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.isObject(body);
    assert.equal(body.id, warehouse.id);
  });

  test('Should not get a warehouse by id that does not exist', async ({ assert }) => {
    const response = await fetch(`${url}/999999`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.NOT_FOUND);
    assert.equal(body.message, 'Warehouse not found');
  });

  test('Should update a warehouse', async ({ assert }) => {
    const warehouse = await repo.save({
      name: faker.company.name(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      currentInventory: faker.number.int({ min: 1, max: 100 }),
      isActive: true,
      managerId: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${warehouse.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.isObject(body);
    assert.equal(body.name, 'New Name');
  });

  test('Should not update a warehouse that does not exist', async ({ assert }) => {
    const response = await fetch(`${url}/999999`, {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.NOT_FOUND);
    assert.equal(body.message, 'Warehouse not found');
  });

  test('Should delete a warehouse', async ({ assert }) => {
    const warehouse = await repo.save({
      name: faker.company.name(),
      capacity: faker.number.int({ min: 1, max: 100 }),
      currentInventory: faker.number.int({ min: 1, max: 100 }),
      isActive: true,
      managerId: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${warehouse.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.OK);

    const deletedWarehouse = await repo.findOne({ where: { id: warehouse.id } });
    assert.isNull(deletedWarehouse);
  });
});
