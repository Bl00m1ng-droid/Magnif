import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import {useToast} from '../context/ToastContext';
import bg from '../assets/magnif-roof-from-machine.png';

function Register(){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {showToast} = useToast();
    const navigate = useNavigate();
    const { checks, passed } = getPasswordStrength(password);
    const isStrong = passed === 5;

    async function handleSubmit(e){
         e.preventDefault();

         if (!isStrong) {
    showToast("Please meet all password requirements", "error");
    return;
  }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful!", "success");
        //clear inputs
        setName("");
        setEmail("");
        setPassword("");

        // Redirect after short delay so user sees the toast
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        showToast(data.message || "Registration failed.", "error");
        //clear password
        setPassword("");
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
      setPassword("");
    }
  }

  function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, passed };
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
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Email"
          type="email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Password"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length > 0 && (
  <ul className="text-xs flex flex-col gap-0.5 mt-1">
    <li className={checks.length ? "text-[#4E9B02]" : "text-[#C23B22]"}>• At least 8 characters</li>
    <li className={checks.upper ? "text-[#4E9B02]" : "text-[#C23B22]"}>• One uppercase letter</li>
    <li className={checks.lower ? "text-[#4E9B02]" : "text-[#C23B22]"}>• One lowercase letter</li>
    <li className={checks.number ? "text-[#4E9B02]" : "text-[#C23B22]"}>• One number</li>
    <li className={checks.special ? "text-[#4E9B02]" : "text-[#C23B22]"}>• One special character</li>
  </ul>
)}

        <button 
          className="bg-[#0B1B42] hover:bg-[#14295C] text-white rounded px-4 py-3 font-semibold transition duration-200"
          type="submit"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-[#F2601C]">
        Already have an account?{" "}
        <Link to="/login" className="text-[#F2601C] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  </div>
);


}

export default Register;