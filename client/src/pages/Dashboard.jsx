import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  // Dashboard Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  // Fetch Dashboard Stats
  const fetchStats = async () => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      // Agar user nahi mila
      if (!user) return;

      const response =
        await API.get(
          `/dashboard-stats/${user._id}`
        );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchStats();

  }, []);

  // Start Interview
  const startInterview = (category) => {

    // Save Category
    localStorage.setItem(
      "category",
      category
    );

    navigate("/interview");

  };

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        {/* Heading */}

        <h1 className="text-6xl font-bold mb-4">
          Welcome, Ahad 👋
        </h1>

        <p className="text-zinc-400 text-2xl mb-14">
          Ready for your AI Interview Practice 🚀
        </p>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* Total Interviews */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">

            <h2 className="text-3xl font-bold mb-4">
              Total Interviews
            </h2>

            <p className="text-6xl font-bold text-blue-500">
              {stats.total}
            </p>

          </div>

          {/* Completed */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">

            <h2 className="text-3xl font-bold mb-4">
              Completed
            </h2>

            <p className="text-6xl font-bold text-green-500">
              {stats.completed}
            </p>

          </div>

          {/* Pending */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">

            <h2 className="text-3xl font-bold mb-4">
              Pending
            </h2>

            <p className="text-6xl font-bold text-yellow-500">
              {stats.pending}
            </p>

          </div>

        </div>

        {/* View History Button */}

        <div className="flex justify-end mb-10">

          <button
            onClick={() => navigate("/history")}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-xl font-bold"
          >
            📜 View History
          </button>

        </div>

        {/* Categories */}

        <h1 className="text-5xl font-bold mb-10">
          Interview Categories 🚀
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Frontend */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">

            <h2 className="text-4xl font-bold mb-4 text-blue-400">
              Frontend
            </h2>

            <p className="text-zinc-400 text-xl mb-8">
              React, HTML, CSS, JavaScript
            </p>

            <button
              onClick={() =>
                startInterview("frontend")
              }
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-xl font-bold w-full"
            >
              Start Frontend
            </button>

          </div>

          {/* Backend */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">

            <h2 className="text-4xl font-bold mb-4 text-green-400">
              Backend
            </h2>

            <p className="text-zinc-400 text-xl mb-8">
              Node.js, Express, MongoDB
            </p>

            <button
              onClick={() =>
                startInterview("backend")
              }
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-xl font-bold w-full"
            >
              Start Backend
            </button>

          </div>

          {/* DSA */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">

            <h2 className="text-4xl font-bold mb-4 text-yellow-400">
              DSA
            </h2>

            <p className="text-zinc-400 text-xl mb-8">
              Arrays, Trees, Graphs, DP
            </p>

            <button
              onClick={() =>
                startInterview("dsa")
              }
              className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 rounded-2xl text-xl font-bold w-full"
            >
              Start DSA
            </button>

          </div>

          {/* Resume Upload */}

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">

            <h2 className="text-4xl font-bold mb-4 text-pink-400">
              Resume AI
            </h2>

            <p className="text-zinc-400 text-xl mb-8">
              Resume Based AI Interview
            </p>

            <button
              onClick={() =>
                navigate("/resume")
              }
              className="bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-2xl text-xl font-bold w-full"
            >
              Upload Resume
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;