import { Router } from "express";
import { fetchSales } from "../controllers/salesController";

const router = Router();

router.get('/sales', fetchSales)

export default router;