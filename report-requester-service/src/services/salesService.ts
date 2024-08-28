import prisma from "../db/prisma";

// Получение продаж с пагинацией и нужными загоовками таблицы
export const getSales = async (page: number = 1, size: number = 10, headers: string[])=>{
    const skip = (page-1)*size;
    const take = size;
    console.log(headers)
    const selectFields = headers.length > 0 ? headers.reduce((acc, header) => {
        if (header in prisma.sales.fields) {
          acc[header] = true;
        }
        return acc;
      }, {} as Record<string, boolean>): undefined;
    console.log(selectFields)
      return prisma.sales.findMany({
        skip,
        take,
        select: selectFields
      });
}