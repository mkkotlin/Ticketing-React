import api from './axios'
import type { LoginResponse, User } from '../types/auth'


export async function login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", username)
    formData.append("password", password)

    const response = await api.post<LoginResponse>(
        "/auth/login",
        formData,
        { headers:{ "Content-Type": "application/x-www-form-urlencoded"}, },
    );
    return response.data
}

export async function getCurrentUser(): Promise<User>{
    const response = await api.get<User>("/auth/me")
    return response.data
}