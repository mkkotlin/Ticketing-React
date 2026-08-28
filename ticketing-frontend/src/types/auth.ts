export interface LoginResponse{
    access_token: string
    token_type: string
}

export interface User{
    id: number
    usernmae: string
    email: string
    role: "CUSTOMER" | "AGENT" | "ADMIN"
    is_active: boolean
}