import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser } from "../api/authApi"
import type { User } from "../types/auth"

interface AuthContextType{
    user: User | null
    token: string | null
    loading: boolean
    loginUser: (token: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({
    children,
}: {
    children: ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"))

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function restoreSession(){
            if (!token){
                setLoading(false)
                return
            }
            if (user) {
                setLoading(false)
                return
            }
            try{
                const currentUser = await getCurrentUser();

                setUser(currentUser);
            } catch {
                localStorage.removeItem("access_token");
                setToken(null)
            } finally {
                setLoading(false)
            }
        }
        restoreSession();
    }, [token, user]);
    async function loginUser(newToken: string){
        localStorage.setItem("access_token", newToken)
        const currentUser = await getCurrentUser();
        setUser(currentUser)
        setToken(newToken)
    }
    function logout(){
        localStorage.removeItem("access_token")
        setToken(null)
        setUser(null)
    }
    return(
        <AuthContext.Provider 
        value={{
            user, token, loading, loginUser, logout
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)
    if (!context){
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context
}