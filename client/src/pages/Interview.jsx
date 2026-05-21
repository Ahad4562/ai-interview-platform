import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Interview() {

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [timeLeft, setTimeLeft] = useState(900);

  const [answer, setAnswer] = useState("");

  const [aiQuestion, setAiQuestion] = useState("");

  const [feedback, setFeedback] = useState("");

  const [score, setScore] = useState(0);

  const [isInterviewStarted, setIsInterviewStarted] =
    useState(false);

  const videoRef = useRef(null);

  const recognitionRef = useRef(null);

  // Resume Analysis
  const resumeData =
    localStorage.getItem("resumeAnalysis");

  // Selected Category
  const category =
    localStorage.getItem("category");

  // Logged User
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // Speak AI Question
  const speakQuestion = (text) => {

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    window.speechSynthesis.speak(speech);

  };

  // Fetch Questions
  const fetchQuestions = async () => {

    try {

      let categoryQuestions = [];

      // Frontend Questions
      if (category === "frontend") {

        categoryQuestions = [

          "What is React?",

          "Explain useEffect Hook.",

          "Difference between let and const?",

          "What is Virtual DOM?",

          "Explain props and state.",

          "Difference between == and ===?",

        ];

      }

      // Backend Questions
      else if (category === "backend") {

        categoryQuestions = [

          "What is Node.js?",

          "Explain Express.js middleware.",

          "What is JWT Authentication?",

          "Explain MongoDB.",

          "Difference between SQL and NoSQL?",

          "What is REST API?",

        ];

      }

      // DSA Questions
      else if (category === "dsa") {

        categoryQuestions = [

          "What is Binary Search?",

          "Explain Time Complexity.",

          "Difference between Stack and Queue?",

          "What is Recursion?",

          "Explain Linked List.",

          "What is Dynamic Programming?",

        ];

      }

      // Default Questions
      else {

        categoryQuestions = [

          "Tell me about yourself.",

          "Why should we hire you?",

          "What are your strengths?",

          "What are your weaknesses?",

        ];

      }

      setQuestions(categoryQuestions);

    } catch (error) {

      console.log(error);

    }

  };

  // Fetch AI Question
  const fetchAIQuestion = async () => {

    try {

      let prompt = "";

      // Resume Based Questions
      if (resumeData) {

        prompt =
          `Generate one interview question based on this resume analysis: ${resumeData}`;

      }

      // Category Based Questions
      else if (category === "frontend") {

        prompt =
          "Generate one frontend interview question about React, JavaScript or CSS.";

      }

      else if (category === "backend") {

        prompt =
          "Generate one backend interview question about Node.js, Express or MongoDB.";

      }

      else if (category === "dsa") {

        prompt =
          "Generate one DSA interview question.";

      }

      else {

        prompt =
          "Generate one HR interview question.";

      }

      const response = await API.post(
        "/evaluate",
        {
          answer: prompt,
        }
      );

      setAiQuestion(response.data.feedback);

      // AI Voice
      speakQuestion(
        response.data.feedback
      );

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchQuestions();

    fetchAIQuestion();

  }, []);

  // Timer
  useEffect(() => {

    if (!isInterviewStarted) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          stopInterview();

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [isInterviewStarted]);

  // Start Interview
  const startInterview = async () => {

    try {

      // Fullscreen
      if (document.documentElement.requestFullscreen) {

        await document.documentElement.requestFullscreen();

      }

      // Camera Permission
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

      }

      setIsInterviewStarted(true);

    } catch (error) {

      console.log(error);

    }

  };

  // Save Interview
  const saveInterview = async (
    interviewStatus
  ) => {

    try {

      await API.post(
        "/save-interview",
        {

          userId: user?._id,

          category:
            category || "resume",

          score,

          feedback,

          status: interviewStatus,

        }
      );

    } catch (error) {

      console.log(error);

    }

  };

  // Stop Interview
  const stopInterview = async () => {

    setIsInterviewStarted(false);

    // Stop AI Voice
    window.speechSynthesis.cancel();

    // Save Interview
    await saveInterview("Completed");

    // Stop Speech Recognition
    if (recognitionRef.current) {

      recognitionRef.current.onend = null;

      recognitionRef.current.stop();

      recognitionRef.current.abort();

      recognitionRef.current = null;

    }

    // Stop Camera
    if (
      videoRef.current &&
      videoRef.current.srcObject
    ) {

      const stream =
        videoRef.current.srcObject;

      stream
        .getTracks()
        .forEach((track) => {

          track.stop();

        });

      videoRef.current.srcObject = null;

    }

    // Exit Fullscreen
    if (document.fullscreenElement) {

      await document.exitFullscreen();

    }

  };

  // Next Question
  const nextQuestion = () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

      setAnswer("");

      setFeedback("");

      fetchAIQuestion();

    }

  };

  // Voice Recognition
  const startListening = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

      recognitionRef.current.abort();

    }

    const recognition =
      new window.webkitSpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0].transcript;

      setAnswer(transcript);

    };

    recognition.onend = () => {

      recognition.stop();

    };

  };

  // AI Evaluation
  const evaluateAnswer = async () => {

    try {

      const response = await API.post(
        "/evaluate",
        {
          answer,
        }
      );

      setFeedback(
        response.data.feedback
      );

      // Random Score
      const randomScore =
        Math.floor(
          Math.random() * 10
        ) + 1;

      setScore(randomScore);

    } catch (error) {

      console.log(error);

    }

  };

  const minutes =
    Math.floor(timeLeft / 60);

  const seconds =
    timeLeft % 60;

  return (

    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="p-8">

        <div className="mb-10">

          <h1 className="text-6xl font-bold mb-4">
            AI Mock Interview 🎤
          </h1>

          <p className="text-zinc-400 text-2xl">
            Practice real interview questions with AI 🚀
          </p>

        </div>

        {resumeData && (

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-10">

            <h2 className="text-3xl font-bold text-green-400 mb-5">
              📄 Resume Based Interview Active
            </h2>

            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {resumeData}
            </p>

          </div>

        )}

        {!isInterviewStarted && (

          <div className="flex justify-center mt-20">

            <button
              onClick={startInterview}
              className="bg-gradient-to-r from-green-500 to-emerald-700 px-12 py-5 rounded-3xl text-3xl font-bold hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              🚀 Start Full Interview
            </button>

          </div>

        )}

        {isInterviewStarted && (

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">

              <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800">

                <div className="flex justify-between items-center mb-8">

                  <h2 className="text-3xl font-bold text-blue-400">
                    Question {currentQuestion + 1}
                  </h2>

                  <div className="bg-red-500/20 text-red-400 px-5 py-2 rounded-2xl text-xl font-bold">
                    ⏱ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </div>

                </div>

                <p className="text-4xl font-semibold leading-relaxed mb-10">
                  {questions[currentQuestion]}
                </p>

                <div className="bg-black p-6 rounded-2xl border border-zinc-700 mb-8">

                  <h3 className="text-2xl font-bold mb-4">
                    🎙 Your Answer
                  </h3>

                  <p className="text-zinc-300 text-xl leading-relaxed min-h-[80px]">
                    {answer || "Start speaking..."}
                  </p>

                </div>

                <div className="flex flex-wrap gap-5">

                  <button
                    onClick={startListening}
                    className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-xl font-bold transition-all"
                  >
                    🎤 Speak
                  </button>

                  <button
                    onClick={nextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-xl font-bold transition-all"
                  >
                    Next →
                  </button>

                  <button
                    onClick={evaluateAnswer}
                    className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-xl font-bold transition-all"
                  >
                    🤖 Evaluate
                  </button>

                  <button
                    onClick={stopInterview}
                    className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl text-xl font-bold transition-all"
                  >
                    ❌ End
                  </button>

                </div>

              </div>

              <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800">

                <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                  📊 AI Feedback
                </h2>

                <p className="text-xl text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {feedback || "AI feedback will appear here..."}
                </p>

              </div>

            </div>

            <div className="space-y-8">

              <div className="bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-800">

                <h2 className="text-2xl font-bold mb-5 text-pink-400">
                  📷 Live Camera
                </h2>

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-2xl border-4 border-zinc-700"
                />

              </div>

              <div className="bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-800">

                <h2 className="text-2xl font-bold text-green-400 mb-5">
                  🤖 AI Question
                </h2>

                <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {aiQuestion}
                </p>

              </div>

              <div className="bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-800">

                <h2 className="text-2xl font-bold text-blue-400 mb-5">
                  🏆 Interview Score
                </h2>

                <p className="text-6xl font-bold text-white">
                  {score}/10
                </p>

              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-3xl shadow-2xl">

                <h2 className="text-2xl font-bold mb-3">
                  🚀 Interview Status
                </h2>

                <p className="text-lg">
                  AI Interview Running Successfully 😈🔥
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default Interview;