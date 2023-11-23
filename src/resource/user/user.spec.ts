import { test } from '@japa/runner';
import { HttpStatus } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import { User } from 'src/database/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from './dto/create-user.dto';

test.group('User e2e', (group) => {
  const url = `${process.env.BASE_URL}/user`;
  const jwtToken = process.env.JWT_TOKEN;

  let repo: Repository<User>;
  group.setup(() => {
    repo = dataSource.createEntityManager().getRepository(User);
  });

  group.each.teardown(async () => {
    await repo.delete({ email: Not('test@sierra.studio') });
  });

  test('Should not create a new user without a jwt token', async ({ assert }) => {
    const userPayload: CreateUserDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    assert.equal(response.status, HttpStatus.UNAUTHORIZED);
  });

  test('Should create a new user', async ({ assert }) => {
    const userPayload: CreateUserDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userPayload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.CREATED);

    const user = await repo.findOne({ where: { email: userPayload.email } });
    assert.isNotNull(user);
  });

  test('Should not create a new user with an existing email', async ({ assert }) => {
    await repo.save({
      name: faker.person.fullName(),
      email: 'test@test.com',
      password: faker.internet.password(),
    })

    const userPayload: CreateUserDto = {
      name: faker.person.fullName(),
      email: 'test@test.com',
      password: faker.internet.password(),
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userPayload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(body.message, 'User already exists');
  });

  test('Should get all users', async ({ assert }) => {
    await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

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

  test('Should get a user by id', async ({ assert }) => {
    const user = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const response = await fetch(`${url}/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.isObject(body);
    assert.equal(body.id, user.id);
  });

  test('Should not get a user by id that does not exist', async ({ assert }) => {
    const response = await fetch(`${url}/999999`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.NOT_FOUND);
    assert.equal(body.message, 'User not found');
  });

  test('Should update a user', async ({ assert }) => {
    const user = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const response = await fetch(`${url}/${user.id}`, {
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

  test('Should not update a user that does not exist', async ({ assert }) => {
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
    assert.equal(body.message, 'User not found');
  });

  test('Should delete a user', async ({ assert }) => {
    const user = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const response = await fetch(`${url}/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    assert.equal(response.status, HttpStatus.OK);

    const deletedUser = await repo.findOne({ where: { id: user.id } });
    assert.isNull(deletedUser);
  });
});
