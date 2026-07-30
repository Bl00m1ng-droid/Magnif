import { createContext,useState,useContext,useEffect } from "react";
{/**Context: sharing whos logged in across the whole app */}
const AuthContext = createContext();

export function AuthProvider({children}){
    const [user,setUser] = useState(null);
    const [token,setToken] = useState(null);

    {/**localstorage - the browsers built-in key-value storage that survives refreshes and even closing the tab
         localStorage.setItem('key', 'value');   // save (string only)
         localStorage.getItem('key');            // read
         localStorage.removeItem('key');         // delete*/}

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if(storedUser && storedToken && storedUser !== "undefined"){
            try{
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (err) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    function login(userData, tokenData){
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    }

    function logout(){
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}