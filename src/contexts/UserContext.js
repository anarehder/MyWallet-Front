import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const User = createContext();

export default function UserProvider({ children}){
    const lsUser = JSON.parse(localStorage.getItem("user"))
    const [userDados, setUserDados] = useState(lsUser === null ? {} : lsUser)
    const navigate = useNavigate();

    useEffect(() => {
         if(lsUser !== null){
             navigate("/home")
         } else {
             navigate("/")
         }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <User.Provider value = {[userDados, setUserDados]}>
            {children}
        </User.Provider>
    )
}