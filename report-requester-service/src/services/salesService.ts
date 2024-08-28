import prisma from "../db/prisma";

// Получение продаж с пагинацией
export const getSales = async (page: number = 1, size: number = 10)=>{
    const skip = (page-1)*size;
    const take = size;
    
      return prisma.sales.findMany({
        skip,
        take
      });
}