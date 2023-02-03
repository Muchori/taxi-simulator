import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTable1675405908746 implements MigrationInterface {
  name = 'UserTable1675405908746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
  }
}
