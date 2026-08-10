import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import bg from '../assets/magnif-roof-from-machine.png';

function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();

        fetch('http://localhost:5000/api/auth/login',{
             method:'POST',
             headers:{'Content-Type' : 'application/json'},
             body: JSON.stringify({name,email,password}),
        })
        .then((res) => res.json())
        .then((data) => {
           /*console.log("Created:", data);
           setEmail('');
           setPassword('');*/
            console.log("LOGIN RESPONSE:", data); // temporary debug line
           login(data.user, data.token); //stores it in a context
        });
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

            <button className="bg-slate-700 text-white rounded px-4 py-2" type="submit" onClick={() => navigate("/")}>
                Login</button>
            
        </form>
        <p className="mt-6 text-center text-slate-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
        </div>
        </div>
    );

}

export default Login;