-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "amount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Worker" ALTER COLUMN "pending_amount" SET DATA TYPE BIGINT,
ALTER COLUMN "locked_amount" SET DATA TYPE BIGINT;
