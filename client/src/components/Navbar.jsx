import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="bg-zinc-900 text-white px-10 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        AI Interview 🚀
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;