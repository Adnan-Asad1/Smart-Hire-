import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
const InterviewSession = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState("00:00");
const startTimeRef = useRef(null);
const timerIntervalRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const [sessionResponse, setSessionResponse] = useState(null);

  const micOnRef = useRef(false);
  const manualStopRef = useRef(false);
  const interviewIdRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const sendingRef = useRef(false);
  const lastSentAnswerRef = useRef("");
  const [isSpeaking, setIsSpeaking] = useState(false); // 🔹 Track if AI is speaking
const [finalBuffer, setFinalBuffer] = useState(""); // 🔹 Permanent collected transcript
const finalBufferRef = useRef("");
const isSpeakingRef = useRef(false);
// ✅ Added this
const [candidateName, setCandidateName] = useState("");
const [candidateEmail, setCandidateEmail] = useState("");

  useEffect(() => {
  const storedData = localStorage.getItem("interviewData");
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData?.questions && Array.isArray(parsedData.questions)) {
        console.log("Questions from localStorage:", parsedData.questions);

        if (parsedData?._id) {
          console.log("Interview ID:", parsedData._id);
          interviewIdRef.current = parsedData._id;

          fetch("http://localhost:5000/api/ConductInterview/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: parsedData._id,
              questions: parsedData.questions
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log("Session start response:", data);
              setSessionResponse(data);
            })
            .catch(err => console.error("Error starting session:", err));
        }
      } else {
        console.warn("No questions array found in stored data.");
      }
    } catch (error) {
      console.error("Error parsing interviewData from localStorage:", error);
    }
  } else {
    console.warn("No interviewData found in localStorage.");
  }

  // Load stored start time
  const storedStartTime = localStorage.getItem("interviewStartTime");
  if (storedStartTime) {
    startTimeRef.current = new Date(storedStartTime);
  } else {
    startTimeRef.current = new Date();
    localStorage.setItem("interviewStartTime", startTimeRef.current.toISOString());
  }

  // ✅ Load candidate details
  const storedName = localStorage.getItem("candidateName");
  const storedEmail = localStorage.getItem("candidateEmail");
  if (storedName) setCandidateName(storedName);
  if (storedEmail) setCandidateEmail(storedEmail);

  // Start interval to update timer
  timerIntervalRef.current = setInterval(() => {
    const now = new Date();
    const diff = now - startTimeRef.current; 
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    setTime(`${minutes}:${seconds}`);
  }, 1000);

  // ✅ Single cleanup only
  return () => {
    clearInterval(timerIntervalRef.current);
    clearTimeout(restartTimeoutRef.current);
    recognitionRef.current?.stop();
    clearTimeout(silenceTimerRef.current);
  };
}, []);








  // 🔹 Function to speak AI response
 // 🔹 Function to speak AI response
const speakText = (text) => {
  if (!text || !window.speechSynthesis) return;
 
  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
      console.log("Mic stopped while AI speaks.");
    } catch (err) {
      console.warn("Error stopping recognition for AI speech:", err);
    }
  }

  setIsSpeaking(true);
  isSpeakingRef.current = true;   // ✅ also mark ref

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    console.log("Speech finished.");
    setIsSpeaking(false);
    isSpeakingRef.current = false;   // ✅ reset ref

    if (micOnRef.current) {
      console.log("Restarting mic after AI finished speaking...");
      setTimeout(() => {
        startRecognitionSafe();
      }, 500);
    }
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error:", e);
    setIsSpeaking(false);
    isSpeakingRef.current = false;   // ✅ reset ref

    if (micOnRef.current) {
      setTimeout(() => {
        startRecognitionSafe();
      }, 500);
    }
  };

  window.speechSynthesis.speak(utterance);
};




 const sendAnswerToBackend = async (answer) => {
  if (!answer || !answer.trim()) return null;

  if (answer.trim() === lastSentAnswerRef.current.trim()) {
    console.log("Same answer as last sent — skipping backend update.");
    return null;
  }

  if (!interviewIdRef.current) {
    console.warn("No interviewId found. Cannot send answer.");
    return null;
  }
  if (sendingRef.current) {
    console.log("Send already in progress — skipping duplicate send.");
    return null;
  }

  sendingRef.current = true;
  clearTimeout(silenceTimerRef.current);
const now = new Date();
const diff = now - startTimeRef.current;
const totalSeconds = Math.floor(diff / 1000);
const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
const seconds = String(totalSeconds % 60).padStart(2, "0");
const liveTime = `${minutes}:${seconds}`;
  try {
    const res = await fetch("http://localhost:5000/api/ConductInterview/conduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: interviewIdRef.current,
        userAnswer: answer,// 🔹 here you pass `finalBuffer`
        time: liveTime,                       // ✅ NEW → send timer value shown on frontend
  candidateName: candidateName,     // ✅ NEW → send candidate name
  candidateEmail: candidateEmail    // ✅ NEW → send candidate email
      })
    });
    const data = await res.json();
    console.log("Conduct interview response:", data);

    lastSentAnswerRef.current = answer.trim();
    setSessionResponse(data);

    // ✅ clear buffers AFTER sending
    setFinalBuffer("");
    setTranscribedText("");

    // 🔹 Speak only the aiResponse text from backend
    if (data?.aiResponse) {
      clearTimeout(silenceTimerRef.current);
      speakText(data.aiResponse);
    }

    return data;
  } catch (err) {
    console.error("Error sending answer:", err);
    return null;
  } finally {
    sendingRef.current = false;
  }
};

  const startRecognitionSafe = () => {
    try {
      startRecognition();
    } catch (err) {
      console.error("Error starting recognition:", err);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

 recognition.onresult = (event) => {
  let interimTranscript = "";
  let finalTranscript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    if (result.isFinal) {
      finalTranscript += result[0].transcript + " ";
    } else {
      interimTranscript += result[0].transcript;
    }
  }

  // ✅ Append finalized text permanently
  if (finalTranscript) {
    setFinalBuffer((prev) => {
      const updated = (prev + " " + finalTranscript).trim();
      finalBufferRef.current = updated;
      return updated;
    });
  }

  // ✅ Show both: permanent + interim (instead of overwriting)
  setTranscribedText(
    (finalBufferRef.current ? finalBufferRef.current + " " : "") + interimTranscript
  );

  // ✅ Silence detection (only when not speaking)
  if (!isSpeakingRef.current) {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (micOnRef.current && !isSpeakingRef.current && finalBufferRef.current.trim()) {
        console.log("Silent — sending final buffer:", finalBufferRef.current);
        
        sendAnswerToBackend(finalBufferRef.current);
        setFinalBuffer("");
        finalBufferRef.current = "";
        
      }
    }, 2000);
  }
};




    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

recognition.onend = () => {
  if (manualStopRef.current) {
    manualStopRef.current = false;
    clearTimeout(silenceTimerRef.current);
    console.log("Recognition ended after manual stop — no duplicate send.");
    return;
  }

  // ✅ Don’t send here — only silence or manual stop can trigger send
  if (isSpeakingRef.current) {
    console.log("Recognition ended because AI is speaking — will restart after speech.");
    return;
  }

  if (micOnRef.current) {
    console.log("Recognition ended unexpectedly — restarting in 500ms...");
    clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = setTimeout(() => {
      try {
        recognition.start();
      } catch (err) {
        console.error("Restart failed:", err);
      }
    }, 500);
  } else {
    console.log("Recognition ended while mic is off.");
  }
};






    recognition.start();
    recognitionRef.current = recognition;
  };

  const toggleRecording = () => {
    if (isSpeaking) {
      console.log("Mic disabled while AI is speaking.");
      return;
    }

    if (isRecording) {
  manualStopRef.current = true;
  micOnRef.current = false;
  clearTimeout(silenceTimerRef.current);

  const current = (finalBufferRef.current || finalBuffer || transcribedText || "").trim();

  if (current) {
    console.log("Mic manually stopped — sending final answer...");
    sendAnswerToBackend(current).finally(() => {
      setFinalBuffer("");
      finalBufferRef.current = "";
      setTranscribedText("");
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.warn("Error stopping recognition after manual stop:", err);
      }
    });
  } else {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.warn("Error stopping recognition (no transcript):", err);
    }
  }

  clearTimeout(restartTimeoutRef.current);
  setIsRecording(false);
}
 else {
      manualStopRef.current = false;
      micOnRef.current = true;
      setTranscribedText("");
      startRecognitionSafe();
      setIsRecording(true);
    }
  };
const handleEndCall = () => {
  // ✅ Step 1: Stop all timers & speech systems first
  clearInterval(timerIntervalRef.current);
  clearTimeout(restartTimeoutRef.current);
  clearTimeout(silenceTimerRef.current);

  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn("Error stopping recognition:", err);
    }
  }

  // ✅ Step 2: Clear session data from localStorage
  localStorage.removeItem("interviewStartTime");
  localStorage.removeItem("interviewData");

  // ✅ Step 3: Reset timer properly
  startTimeRef.current = null;
  setTime("00:00");

  // ✅ Step 4: Give React state a moment to update before navigating
  setTimeout(() => {
    navigate("/thankyou", { replace: true });
  }, 300);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center justify-between py-10 px-4 text-gray-800">
      <div className="w-full max-w-6xl flex justify-between items-center px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">AI Interview Session</h2>
        <div className="flex items-center text-sm font-medium bg-white border border-blue-100 rounded-full px-4 py-2 shadow">
          <FaClock className="mr-2 text-blue-500" />
          <span>{time}</span>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 mb-10 px-6">
        <div className="bg-white border border-blue-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md transition-transform hover:scale-105">
          <div className="border-4 border-blue-500 rounded-full p-1 mb-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="AI Recruiter"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">AI Recruiter</h3>
          <p className="text-sm text-gray-500">Virtual Interviewer</p>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md transition-transform hover:scale-105">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
            C
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Candidate</h3>
          <p className="text-sm text-gray-500">Candidate</p>
        </div>
      </div>

      <div className="bg-white border border-blue-100 rounded-xl shadow-md p-6 w-full max-w-4xl mb-6">
        <h4 className="text-lg font-semibold mb-2">Transcription:</h4>
        <pre className="whitespace-pre-wrap text-gray-700">
          {transcribedText || "🎤 Speak to start transcription..."}
        </pre>
      </div>


<div className="bg-white border border-blue-100 rounded-xl shadow-md p-6 w-full max-w-4xl mb-6">
  <h4 className="text-lg font-semibold mb-2">Transcription:</h4>
  <pre className="whitespace-pre-wrap text-gray-700">
    {finalBuffer && <span className="text-black">{finalBuffer} </span>}
    <span className="text-gray-400">{transcribedText}</span>
  </pre>
</div>







      <div className="bg-white border border-blue-100 rounded-full shadow-md px-10 py-6 flex items-center justify-center gap-10 mb-6">
        <button
          onClick={toggleRecording}
          disabled={isSpeaking} // 🔹 Disable while AI is speaking
          className={`p-4 rounded-full shadow-md transition-transform hover:scale-110 ${
            isRecording ? "bg-green-600 text-white" : "bg-gray-800 text-white"
          } ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? <FaMicrophone className="text-xl" /> : <FaMicrophoneSlash className="text-xl" />}
        </button>
        <button
         onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-md transition-transform hover:scale-110"
        >
          <FaPhoneSlash className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;