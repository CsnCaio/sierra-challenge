import { assert } from '@japa/assert';
import { configure, run } from '@japa/runner';
import { specReporter } from '@japa/spec-reporter';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { command } from 'execa';
import { AppModule } from 'src/app.module';

let app: INestApplication;
async function runMigrations() {
  console.log('============== START RUNNING MIGRATIONS ==============');
  await command('pnpm migration:run');
  console.log('============== END RUNNING MIGRATIONS ==============');
}

async function startHttpServer() {
  console.log('============== START SERVER ==============');
  const appVersion = '2';
  app = await NestFactory.create(AppModule, {
    logger: ['error'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableVersioning({
    defaultVersion: appVersion,
    type: VersioningType.URI,
  });
  await app.listen(3000);
  console.log('============== SERVER STARTED ==============');
}

async function stopHttpServer() {
  console.log('============== CLOSING SERVER ==============');
  await app.close();
  console.log('============== SERVER CLOSED ==============');
}

async function revertMigrations() {
  console.log('============== START DROP MIGRATIONS ==============');
  await command('pnpm migration:drop');
  console.log('============== END DROP MIGRATIONS ==============');
}

configure({
  files: ['src/**/*.e2e-spec.ts', 'src/**/*.spec.ts'],
  setup: [runMigrations, startHttpServer],
  teardown: [stopHttpServer, revertMigrations],
  plugins: [assert()],
  reporters: [specReporter()],
  importer: (filePath) => import(filePath),
  forceExit: true,
});

run();
