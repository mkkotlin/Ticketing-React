export interface LoginResponse{
    access_token: string
    token_type: string
}

export interface User{
    id: number
    username: string
    email: string
    role: "CUSTOMER" | "AGENT" | "ADMIN"
    is_active: boolean
}