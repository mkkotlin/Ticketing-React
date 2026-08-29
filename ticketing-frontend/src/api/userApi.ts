import api from "./axios";
import type { User } from "../types/auth";

export async function getAgents(): Promise<User[]> {
  const response = await api.get<User[]>(
    "/users",
    {
      params: {
        role: "AGENT",
      },
    }
  );

  return response.data;
}
