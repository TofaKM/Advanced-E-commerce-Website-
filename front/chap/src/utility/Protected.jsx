import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthProvider'

const ProtectedRoutes = ({element,requiredRole}) =>{
    const {user} = useAuth()

    if(!user){
        return <Navigate to="/login" replace></Navigate>
    }

    if(requiredRole && user.role !== requiredRole){
        return <Navigate to="/" replace />
    }
    return element
}

export default ProtectedRoutes