import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { HttpStatus } from '@nestjs/common';
import { dataSource } from 'src/database/data-source';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin.dto';
import { SecurityUtil } from 'src/utils/security.util';

test.group('Auth e2e', (group) => {
  const url = `${process.env.BASE_URL}/auth`;

  let repo: Repository<User>;
  group.setup(() => {
    repo = dataSource.createEntityManager().getRepository(User);
  });

  test('Should be able to signIn and receive a token', async ({ assert }) => {
    const rawPassword = faker.internet.password();

    const user = await repo.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await SecurityUtil.hash(rawPassword),
    });

    const signInPayload: SignInDto = {
      email: user.email,
      password: rawPassword
    };

    const response = await fetch(`${url}/sign-in`, {
      method: 'POST',
      body: JSON.stringify(signInPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.OK);
    assert.exists(body.accessToken);
  });

  test('Should not be able to signIn with invalid credentials', async ({ assert }) => {
    const signInPayload: SignInDto = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await fetch(`${url}/sign-in`, {
      method: 'POST',
      body: JSON.stringify(signInPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await response.json();

    assert.equal(response.status, HttpStatus.BAD_REQUEST);
    assert.equal(body.message, 'Invalid credentials');
  });
});
