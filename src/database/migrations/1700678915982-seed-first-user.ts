import { SecurityUtil } from "src/utils/security.util";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedFirstUser1700678915982 implements MigrationInterface {
    name = 'SeedFirstUser1700678915982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = await SecurityUtil.hash('sierra@123456#');

        // SEED USER
        await queryRunner.query(`
            INSERT INTO "user" (name, email, password, revoked)
            VALUES (
                'Admin',
                'test@sierra.studio',
                '${password}',
                false
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE email = 'test@sierra.studio';
        `);
    }
}
