import {  Request, Response } from "express";
import { getSales } from "../services/salesService";

// Получение продаж
export const fetchSales = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      
      const sales = await getSales(page, size);
      
      res.json(sales);
    } catch (error) {
      res.status(500).send(error);
    }
  };