import API from "../services/api";
import { useState } from "react";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      const response = await API.post("/signup", {
        name,
        email,
        password,
      });

      alert(response.data.message);

    } catch (error) {

      alert("Signup Failed");

      console.log(error);

    }

  };

  return (

    <div className="h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px]">

        <h1 className="text-white text-4xl font-bold mb-6">
          Signup 🚀
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-zinc-800 text-white"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-zinc-800 text-white"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg mb-6 bg-zinc-800 text-white"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 py-3 rounded-lg text-white hover:bg-green-700"
        >
          Signup
        </button>

      </div>

    </div>
  );
}

export default Signup;