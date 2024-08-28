import { PrismaClient } from "@prisma/client";


export async function dbInit(prisma: PrismaClient){
    try {
        await prisma.sales.deleteMany({})
        await prisma.sales.createMany({
            data: dataForInitialisation,
            skipDuplicates: true 
        });

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}



const dataForInitialisation = [
    { productName: 'Laptop', date: new Date('2024-08-01'), quantity: 10, price: 999.99 },
    { productName: 'Smartphone', date: new Date('2024-08-03'), quantity: 25, price: 499.99 },
    { productName: 'Headphones', date: new Date('2024-08-05'), quantity: 15, price: 89.99 },
    { productName: 'Keyboard', date: new Date('2024-08-07'), quantity: 30, price: 29.99 },
    { productName: 'Monitor', date: new Date('2024-08-10'), quantity: 8, price: 199.99 },
    { productName: 'Mouse', date: new Date('2024-08-12'), quantity: 20, price: 24.99 },
    { productName: 'Printer', date: new Date('2024-08-15'), quantity: 5, price: 149.99 },
    { productName: 'Webcam', date: new Date('2024-08-18'), quantity: 12, price: 79.99 },
    { productName: 'External Hard Drive', date: new Date('2024-08-21'), quantity: 7, price: 129.99 },
    { productName: 'Tablet', date: new Date('2024-08-25'), quantity: 18, price: 349.99 },
    { productName: 'Smartwatch', date: new Date('2024-08-02'), quantity: 14, price: 199.99 },
    { productName: 'Wireless Charger', date: new Date('2024-08-04'), quantity: 22, price: 39.99 },
    { productName: 'Bluetooth Speaker', date: new Date('2024-08-06'), quantity: 17, price: 149.99 },
    { productName: 'Action Camera', date: new Date('2024-08-08'), quantity: 9, price: 249.99 },
    { productName: 'Gaming Console', date: new Date('2024-08-11'), quantity: 6, price: 399.99 },
    { productName: 'Digital Camera', date: new Date('2024-08-13'), quantity: 11, price: 549.99 },
    { productName: 'Laptop Stand', date: new Date('2024-08-16'), quantity: 35, price: 69.99 },
    { productName: 'Desk Lamp', date: new Date('2024-08-19'), quantity: 20, price: 49.99 },
    { productName: 'Router', date: new Date('2024-08-22'), quantity: 13, price: 89.99 },
    { productName: 'USB Flash Drive', date: new Date('2024-08-26'), quantity: 40, price: 19.99 }
]