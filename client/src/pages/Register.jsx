import { useState } from "react";
import { Link } from "react-router-dom";
import bg from '../assets/magnif-roof-from-machine.png';

function Register(){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        fetch('http://localhost:5000/api/auth/register',{
             method:'POST',
             headers:{'Content-Type' : 'application/json'},
             body: JSON.stringify({name,email,password}),
        })
        .then((res) => res.json())
        .then((data) => {
           console.log("Created:", data);
           setName('');
           setEmail('');
           setPassword('');
        });
    }

   return (
  <div 
    className="flex items-center justify-center min-h-screen bg-cover bg-center  px-4 sm:px-6 lg:px-8" 
    style={{ backgroundImage: `url(${bg})` }} 
  >
    
    <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 sm:p-8 md:p-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
        Create Your Account
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="bg-slate-700 hover:bg-slate-900 text-white rounded px-4 py-3 font-semibold transition duration-200"
          type="submit"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);


}

export default Register;