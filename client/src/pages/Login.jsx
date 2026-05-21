import API from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/dashboard");

    } catch (error) {

      alert("Login Failed");

      console.log(error);

    }

  };

  return (

    <div className="h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px]">

        <h1 className="text-white text-4xl font-bold mb-6">
          Login 🚀
        </h1>

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
          onClick={handleLogin}
          className="w-full bg-blue-600 py-3 rounded-lg text-white hover:bg-blue-700"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;