import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1753097863065 implements MigrationInterface {
  name = 'Mig1753097863065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_log" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_log"`);
  }
}
