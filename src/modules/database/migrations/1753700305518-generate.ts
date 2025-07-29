import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1753700305518 implements MigrationInterface {
    name = 'Generate1753700305518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "label" text NOT NULL, "path" text, "icon" text, "order" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_item_relations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "menu_item_id" uuid NOT NULL, "parent_id" uuid NOT NULL, CONSTRAINT "PK_073a282c9abb1dff816a1e7e0ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(50) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "menu_item_relations" ADD CONSTRAINT "FK_cfdbd957740f9568259caf9b3cc" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_relations" ADD CONSTRAINT "FK_67dc2cd20ce310152b3f64413b0" FOREIGN KEY ("parent_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_item_relations" DROP CONSTRAINT "FK_67dc2cd20ce310152b3f64413b0"`);
        await queryRunner.query(`ALTER TABLE "menu_item_relations" DROP CONSTRAINT "FK_cfdbd957740f9568259caf9b3cc"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TABLE "menu_item_relations"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
    }

}
