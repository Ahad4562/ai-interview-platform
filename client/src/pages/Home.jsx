import { Link } from "react-router-dom";

function Home() {

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-7xl font-bold mb-6">
          AI Interview 🚀
        </h1>

        <p className="text-zinc-400 text-2xl mb-10">
          Practice AI Powered Mock Interviews 😎
        </p>

        <div className="flex gap-6 justify-center">

          <Link to="/login">

            <button className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-2xl text-xl font-bold">

              Login

            </button>

          </Link>

          <Link to="/signup">

            <button className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-2xl text-xl font-bold">

              Signup

            </button>

          </Link>

        </div>

      </div>

    </div>

  );
}

export default Home;