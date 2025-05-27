import { z } from "zod";
import { selectProductsSchema } from "./db/schema";

export const productsSchema = z.infer<typeof selectProductsSchema>;

type Product = z.infer<typeof selectProductsSchema>;
