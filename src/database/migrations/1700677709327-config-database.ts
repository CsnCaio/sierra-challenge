import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigDatabase1700677709327 implements MigrationInterface {
    name = 'ConfigDatabase1700677709327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "zip" character varying NOT NULL, "city" character varying NOT NULL, "number" character varying NOT NULL, "state" character varying, "street" character varying, "country" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "capacity" integer NOT NULL, "currentInventory" integer NOT NULL, "isActive" boolean NOT NULL, "managerId" integer, CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d5d5470e55d4238b1239e9f154" ON "warehouse" ("name") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying(254) NOT NULL, "password" character varying, "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "birthDate" date NOT NULL, "email" character varying(254) NOT NULL, "addressId" integer, "createdById" integer, CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "REL_7697a356e1f4b79ab3819839e9" UNIQUE ("addressId"), CONSTRAINT "REL_06da83f09c12364501434a415f" UNIQUE ("createdById"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac1455877a69957f7466d5dc78" ON "customer" ("name") `);
        await queryRunner.query(`ALTER TABLE "warehouse" ADD CONSTRAINT "FK_365d11d960742455a78593b5784" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_7697a356e1f4b79ab3819839e95" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_06da83f09c12364501434a415f9" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_06da83f09c12364501434a415f9"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_7697a356e1f4b79ab3819839e95"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP CONSTRAINT "FK_365d11d960742455a78593b5784"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac1455877a69957f7466d5dc78"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d5d5470e55d4238b1239e9f154"`);
        await queryRunner.query(`DROP TABLE "warehouse"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
