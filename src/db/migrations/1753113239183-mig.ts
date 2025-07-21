import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1753113239183 implements MigrationInterface {
  name = 'Mig1753113239183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "city" character varying, "country" character varying, "organization" character varying, "region" character varying, "event" character varying, "date" TIMESTAMP, "event_properties" jsonb DEFAULT '{}', "project_id" character varying, "interview_id" character varying, "transcript_id" character varying, "button_id" character varying, CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_347436f8015ef06fd456b52592" ON "user_log" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7588fe323f328dc8ff580c299b" ON "user_log" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b194d1d6fe88cc332b05004fe" ON "user_log" ("country") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d976970fcddcfdf05c1a8f8c57" ON "user_log" ("organization") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa54ea308ede703d95dc19cf32" ON "user_log" ("region") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e14c9dafe678e3c49412cf9265" ON "user_log" ("event") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f336a0022d21a9e00bb01ab29" ON "user_log" ("date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b5cd9f5ee3ab225a1f0689593" ON "user_log" ("event_properties") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61cfcf81518083757ca6e69eed" ON "user_log" ("project_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f41cb72ea5bd19086e86d08a2" ON "user_log" ("interview_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d76b86fe3a2092121d4bf84a7" ON "user_log" ("transcript_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e7a1b6c582ab11251dd1793b4" ON "user_log" ("button_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e7a1b6c582ab11251dd1793b4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4d76b86fe3a2092121d4bf84a7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f41cb72ea5bd19086e86d08a2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61cfcf81518083757ca6e69eed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b5cd9f5ee3ab225a1f0689593"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f336a0022d21a9e00bb01ab29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e14c9dafe678e3c49412cf9265"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aa54ea308ede703d95dc19cf32"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d976970fcddcfdf05c1a8f8c57"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b194d1d6fe88cc332b05004fe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7588fe323f328dc8ff580c299b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_347436f8015ef06fd456b52592"`,
    );
    await queryRunner.query(`DROP TABLE "user_log"`);
  }
}
