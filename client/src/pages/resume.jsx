import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Resume() {

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [uploaded, setUploaded] = useState(false);

  const [analysis, setAnalysis] = useState("");

  // Upload Resume
  const handleResume = async (e) => {

    try {

      const file = e.target.files[0];

      setResume(file);

      setUploaded(true);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await API.post(
        "/resume-analysis",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data.analysis);

      // Save Analysis
      localStorage.setItem(
        "resumeAnalysis",
        response.data.analysis
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-10 flex flex-col items-center">

        {/* Heading */}

        <h1 className="text-6xl font-bold mb-6">
          Resume Upload 📄
        </h1>

        <p className="text-zinc-400 text-xl mb-12">
          Upload your resume for AI based interview 🚀
        </p>

        {/* Upload Box */}

        <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-4xl text-center shadow-2xl border border-zinc-800">

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResume}
            className="mb-8 text-lg"
          />

          {/* Uploaded */}

          {uploaded && (

            <div className="mt-6">

              <h2 className="text-2xl font-bold text-green-400 mb-4">
                ✅ Resume Uploaded
              </h2>

              <p className="text-zinc-300 text-lg">
                {resume?.name}
              </p>

            </div>

          )}

          {/* AI Analysis */}

          {uploaded && (

            <div className="mt-10 bg-black p-8 rounded-2xl border border-zinc-700 text-left">

              <h2 className="text-3xl font-bold text-blue-400 mb-6">
                🤖 AI Resume Analysis
              </h2>

              <p className="text-zinc-300 text-lg whitespace-pre-wrap leading-relaxed">
                {analysis || "Analyzing Resume..."}
              </p>

            </div>

          )}

          {/* Start Interview Button */}

          {uploaded && (

            <button
              onClick={() => navigate("/interview")}
              className="mt-10 bg-green-600 hover:bg-green-700 px-10 py-4 rounded-2xl text-2xl font-bold"
            >
              🚀 Start Resume Based Interview
            </button>

          )}

        </div>

      </div>

    </div>

  );
}

export default Resume;