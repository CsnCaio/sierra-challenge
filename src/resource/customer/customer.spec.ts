import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { HttpStatus } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import { Customer } from 'src/database/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

test.group('Customer e2e', (group) => {
  const url = `${process.env.BASE_URL}/customer`;
  const jwtToken = process.env.JWT_TOKEN;

  let repo: Repository<Customer>;
  group.setup(() => {
    repo = dataSource.createEntityManager().getRepository(Customer);
  });

  let customerPayload: CreateCustomerDto;
  group.each.setup(async () => {
    customerPayload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
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

  test('Should not create a new customer without a jwt token', async ({ assert }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(customerPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    assert.equal(response.status, HttpStatus.UNAUTHORIZED);
  });

  test('Should create a new customer', async ({ assert }) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(customerPayload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.CREATED);

    const customer = await repo.findOne({ where: { email: customerPayload.email } });
    assert.isNotNull(customer);
  });

  test('Should not create a new customer with an existing email', async ({ assert }) => {
    const email = faker.internet.email();
    await repo.save({
      name: faker.person.fullName(),
      email,
      birthDate: faker.date.past(),
      createdById: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...customerPayload,
        email
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(body.message, 'Customer already exists');
  });

  test('Should get all customers', async ({ assert }) => {
    for (let i = 0; i < 10; i++) {
      await repo.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDate: faker.date.past(),
        createdById: 1,
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

  test('Should get a customer by id', async ({ assert }) => {
    const customer = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.past(),
      createdById: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${customer.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.isObject(body);
    assert.equal(body.id, customer.id);
  });

  test('Should not get a customer by id that does not exist', async ({ assert }) => {
    const response = await fetch(`${url}/999999`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.NOT_FOUND);
    assert.equal(body.message, 'Customer not found');
  });

  test('Should update a customer', async ({ assert }) => {
    const customer = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.past(),
      createdById: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${customer.id}`, {
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

  test('Should not update a customer that does not exist', async ({ assert }) => {
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
    assert.equal(body.message, 'Customer not found');
  });

  test('Should delete a customer', async ({ assert }) => {
    const customer = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.past(),
      createdById: 1,
      address: {
        zip: faker.location.zipCode(),
        city: faker.location.city(),
        number: Number(faker.location.buildingNumber()),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        country: faker.location.country(),
      }
    });

    const response = await fetch(`${url}/${customer.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.OK);

    const deletedCustomer = await repo.findOne({ where: { id: customer.id } });
    assert.isNull(deletedCustomer);
  });
});
