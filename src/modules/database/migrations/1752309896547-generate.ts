import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1752309896547 implements MigrationInterface {
    name = 'Generate1752309896547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(255), "description" text, "content" text NOT NULL DEFAULT '', "notebook_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_768b444e7860dbee568d81ccbda" FOREIGN KEY ("notebook_id") REFERENCES "notebooks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_654d6da35fcab12c3905725a416" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_654d6da35fcab12c3905725a416"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_768b444e7860dbee568d81ccbda"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
