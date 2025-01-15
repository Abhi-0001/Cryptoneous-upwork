import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getNextTask(workerId: number) {
    return await prisma.task.findFirst({where: {
        submissions: {
          none: {
            workerId
          }
        }
      }, select: {
        title: true, options: true, amount: true, Id: true
      }})
}