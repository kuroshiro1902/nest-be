import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1752316119298 implements MigrationInterface {
    name = 'Generate1752316119298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notebook_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "notebook_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "UQ_7d6f3306edb27f3567b8d3ee1c2" UNIQUE ("notebook_id", "tag_id"), CONSTRAINT "PK_db214dc693191eee5fea897de84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "slug" text NOT NULL, "description" text, "created_by" uuid, CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "note_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "UQ_fdb07cb0571e1ecfaeffc703281" UNIQUE ("note_id", "tag_id"), CONSTRAINT "PK_ca61a805f00b069d6a9ec15b56b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notebook_tags" ADD CONSTRAINT "FK_b9f7dc8d163cf02086f9668fb23" FOREIGN KEY ("notebook_id") REFERENCES "notebooks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notebook_tags" ADD CONSTRAINT "FK_6c463b933e59a71b8717af33e41" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_32f027a90ce9c91c9b8ff830d22" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note_tags" ADD CONSTRAINT "FK_6fa35b8ead30ef28cc1ac377b21" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note_tags" ADD CONSTRAINT "FK_898115de9eadba996d4323ff0b6" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_tags" DROP CONSTRAINT "FK_898115de9eadba996d4323ff0b6"`);
        await queryRunner.query(`ALTER TABLE "note_tags" DROP CONSTRAINT "FK_6fa35b8ead30ef28cc1ac377b21"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_32f027a90ce9c91c9b8ff830d22"`);
        await queryRunner.query(`ALTER TABLE "notebook_tags" DROP CONSTRAINT "FK_6c463b933e59a71b8717af33e41"`);
        await queryRunner.query(`ALTER TABLE "notebook_tags" DROP CONSTRAINT "FK_b9f7dc8d163cf02086f9668fb23"`);
        await queryRunner.query(`DROP TABLE "note_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "notebook_tags"`);
    }

}
