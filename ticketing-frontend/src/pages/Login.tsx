import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const navigate = useNavigate()
    const { loginUser } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await login(username, password)
            await loginUser(data.access_token)
            navigate("/dashboard")
        } catch {
            setError("Invalid username or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in.." : "Login"}
                </button>
            </form>
        </div>
    )
}