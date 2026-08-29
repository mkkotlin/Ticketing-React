import api from "./axios";
import type { Category } from "../types/ticket";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>(
    "/category"
  );

  return response.data;
}
