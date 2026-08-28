import AppRoutes from "./routes/AppRouters";
import { AuthProvider } from "./context/AuthContext"

function App(){
    return (
    <AuthProvider>
        <AppRoutes />
        </AuthProvider>
        )
}


export default App