import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function History() {

  const [history, setHistory] = useState([]);

  // Logged User
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // Fetch History
  const fetchHistory = async () => {

    try {

      const response =
        await API.get(
          `/interview-history/${user._id}`
        );

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchHistory();

  }, []);

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10">

        {/* Heading */}

        <h1 className="text-6xl font-bold mb-4">
          Interview History 📜
        </h1>

        <p className="text-zinc-400 text-2xl mb-14">
          Your past AI interviews 🚀
        </p>

        {/* History Cards */}

        <div className="grid gap-8">

          {history.length > 0 ? (

            history.map((item, index) => (

              <div
                key={index}
                className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl"
              >

                <div className="flex justify-between items-center mb-6">

                  <h2 className="text-4xl font-bold text-blue-400 capitalize">
                    {item.category}
                  </h2>

                  <span className="bg-green-600 px-5 py-2 rounded-2xl text-xl font-bold">
                    {item.status}
                  </span>

                </div>

                {/* Score */}

                <div className="mb-6">

                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    🏆 Score
                  </h3>

                  <p className="text-5xl font-bold">
                    {item.score}/10
                  </p>

                </div>

                {/* Feedback */}

                <div className="mb-6">

                  <h3 className="text-2xl font-bold text-pink-400 mb-2">
                    🤖 Feedback
                  </h3>

                  <p className="text-zinc-300 text-lg whitespace-pre-wrap leading-relaxed">
                    {item.feedback}
                  </p>

                </div>

                {/* Date */}

                <div>

                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    📅 Date
                  </h3>

                  <p className="text-zinc-400 text-lg">
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            ))

          ) : (

            <div className="bg-zinc-900 p-10 rounded-3xl text-center border border-zinc-800">

              <h2 className="text-4xl font-bold mb-4">
                No Interview History 😭
              </h2>

              <p className="text-zinc-400 text-xl">
                Start your first AI interview 🚀
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default History;