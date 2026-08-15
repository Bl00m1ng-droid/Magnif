import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import bg from '../assets/magnif-roof-from-machine.png';
import { useToast } from "../context/ToastContext";

function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const {showToast} = useToast();


    async function handleSubmit(e){
        e.preventDefault();
        setErrorMessage("");

         try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        showToast(`Welcome back, ${data.user.name}`, "success");
        navigate("/");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
        setPassword("");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
    }

    return(
        <div className="flex justify-center items-center min-h-screen  bg-cover bg-center px-4 sm:px-6 lg:px-8 "
        style={{ backgroundImage: `url(${bg})` }} >
        
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 sm:p-8 md:p-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
        Login 
      </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">

             <input
           className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

             <input
            className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            {errorMessage && (
            <p className="text-[#C23B22] text-sm bg-[#C23B22]/5 border border-[#C23B22]/20 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}

            <button className="bg-[#0b1b42] hover:bg-[#14295c] text-white rounded px-4 py-2" type="submit" >
                Sign In</button>
            
        </form>
        <p className="mt-6 text-center text-[#f2601c]">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#f2601c] hover:underline">
          Sign Up
        </Link>
      </p>
        </div>
        </div>
    );

}

export default Login;