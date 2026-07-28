import { useState } from "react";

function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();

        fetch('http://localhost:5000/api/auth/login',{
             method:'POST',
             headers:{'Content-Type' : 'application/json'},
             body: JSON.stringify({name,email,password}),
        })
        .then((res) => res.json())
        .then((data) => {
           console.log("Created:", data);
           setEmail('');
           setPassword('');
        });
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 max-w-sm">

             <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

             <input
            className="border p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button className="bg-slate-700 text-white rounded px-4 py-2" type="submit">
                Login</button>
            

        </form>
    );

}

export default Login;