import {MigrationInterface, QueryRunner} from "typeorm";

export class createAt21626967578577 implements MigrationInterface {
    name = 'createAt21626967578577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `messages` ADD `createAt2` timestamp NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `messages` DROP COLUMN `createAt2`");
    }

}
