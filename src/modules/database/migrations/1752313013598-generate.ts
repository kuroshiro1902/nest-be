import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1752313013598 implements MigrationInterface {
    name = 'Generate1752313013598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notebooks" ADD "status" text NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notebooks" DROP COLUMN "status"`);
    }

}
