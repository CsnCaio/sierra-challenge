import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAddressFields1700709979621 implements MigrationInterface {
    name = 'ChangeAddressFields1700709979621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "zip"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longitude" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "street" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "number" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "zip" character varying NOT NULL`);
    }

}
