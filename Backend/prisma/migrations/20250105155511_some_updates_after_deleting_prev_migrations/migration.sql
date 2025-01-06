-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Task" (
    "Id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'select most clickable picture/thumbnail',
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Option" (
    "Id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "Id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "pending_amount" INTEGER NOT NULL,
    "locked_amount" INTEGER NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "Id" SERIAL NOT NULL,
    "workerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Id_key" ON "User"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Task_Id_key" ON "Task"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Option_Id_key" ON "Option"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_Id_key" ON "Worker"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_address_key" ON "Worker"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_Id_key" ON "Submission"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_workerId_taskId_key" ON "Submission"("workerId", "taskId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
