import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── users ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('SUPERADMIN', 'ADMIN')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"        SERIAL NOT NULL,
        "fullName"  character varying NOT NULL,
        "phone"     character varying NOT NULL,
        "password"  character varying NOT NULL,
        "role"      "public"."users_role_enum" NOT NULL DEFAULT 'ADMIN',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_phone" UNIQUE ("phone"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // ─── teachers ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "teachers" (
        "id"        SERIAL NOT NULL,
        "fullName"  character varying NOT NULL,
        "phone"     character varying NOT NULL,
        "subject"   character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_teachers" PRIMARY KEY ("id")
      )
    `);

    // ─── groups ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "groups" (
        "id"        SERIAL NOT NULL,
        "name"      character varying NOT NULL,
        "teacherId" integer,
        "schedule"  character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_groups" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "groups"
        ADD CONSTRAINT "FK_groups_teacher"
          FOREIGN KEY ("teacherId")
          REFERENCES "teachers"("id")
          ON DELETE SET NULL
    `);

    // ─── students ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "public"."students_status_enum" AS ENUM('active', 'inactive')
    `);

    await queryRunner.query(`
      CREATE TABLE "students" (
        "id"        SERIAL NOT NULL,
        "fullName"  character varying NOT NULL,
        "phone"     character varying NOT NULL,
        "status"    "public"."students_status_enum" NOT NULL DEFAULT 'active',
        "groupId"   integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "leftAt"    TIMESTAMP,
        CONSTRAINT "PK_students" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "students"
        ADD CONSTRAINT "FK_students_group"
          FOREIGN KEY ("groupId")
          REFERENCES "groups"("id")
          ON DELETE SET NULL
    `);

    // ─── payments ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id"        SERIAL NOT NULL,
        "studentId" integer NOT NULL,
        "amount"    numeric(10,2) NOT NULL,
        "date"      date NOT NULL,
        "note"      character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
        ADD CONSTRAINT "FK_payments_student"
          FOREIGN KEY ("studentId")
          REFERENCES "students"("id")
          ON DELETE CASCADE
    `);

    // ─── attendance ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "public"."attendance_status_enum" AS ENUM('present', 'absent')
    `);

    await queryRunner.query(`
      CREATE TABLE "attendance" (
        "id"        SERIAL NOT NULL,
        "studentId" integer NOT NULL,
        "groupId"   integer NOT NULL,
        "status"    "public"."attendance_status_enum" NOT NULL DEFAULT 'present',
        "date"      date NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attendance" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "attendance"
        ADD CONSTRAINT "FK_attendance_student"
          FOREIGN KEY ("studentId")
          REFERENCES "students"("id")
          ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "attendance"
        ADD CONSTRAINT "FK_attendance_group"
          FOREIGN KEY ("groupId")
          REFERENCES "groups"("id")
          ON DELETE CASCADE
    `);

    // ─── requests ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "public"."requests_status_enum" AS ENUM('new', 'in_progress', 'done', 'rejected')
    `);

    await queryRunner.query(`
      CREATE TABLE "requests" (
        "id"        SERIAL NOT NULL,
        "name"      character varying NOT NULL,
        "phone"     character varying NOT NULL,
        "message"   character varying,
        "status"    "public"."requests_status_enum" NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_requests" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Jadvallarni teskari tartibda o'chirish (FK bog'liqliklarini hisobga olib)
    await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_attendance_group"`);
    await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_attendance_student"`);
    await queryRunner.query(`ALTER TABLE "payments"   DROP CONSTRAINT "FK_payments_student"`);
    await queryRunner.query(`ALTER TABLE "students"   DROP CONSTRAINT "FK_students_group"`);
    await queryRunner.query(`ALTER TABLE "groups"     DROP CONSTRAINT "FK_groups_teacher"`);

    await queryRunner.query(`DROP TABLE "requests"`);
    await queryRunner.query(`DROP TABLE "attendance"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "teachers"`);
    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."students_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
