-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- CreateTable
CREATE TABLE "Payouts" (
    "Id" SERIAL NOT NULL,
    "userId" INTEGER,
    "workerId" INTEGER,
    "amount" INTEGER NOT NULL,
    "status" "TxnStatus" NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Payouts_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payouts_Id_key" ON "Payouts"("Id");

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
