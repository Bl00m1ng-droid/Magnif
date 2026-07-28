import { useState } from "react";

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

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 max-w-sm">
            <input
            className="border p-2 rounded"
            placeholder="Name"
            value={name} //tied to a state variable
            onChange={(e) => setName(e.target.value)} //updates the state on every key stroke
            />

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
                Register</button>
            

        </form>
    );

}

export default Register;