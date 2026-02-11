import React, { useState, useEffect, useRef } from "react";

const AssemblyAiLive = () => {
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false); // 🔄 FIXED: track connection state
  const wsRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);

  const connectAssemblyAI = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/realtime-token");
      const { token } = await res.json();
      if (!token) {
        console.error("❌ No token received from backend!");
        return;
      }

      // ✅ Use new model
      const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log("✅ Connected to AssemblyAI Realtime");
        setIsConnected(true);

        // 🎙️ Capture mic audio
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });

        // 🔄 FIXED: Use modern AudioWorklet instead of deprecated ScriptProcessorNode
        await audioContextRef.current.audioWorklet.addModule("/processor.js");
        const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
        const processor = new AudioWorkletNode(audioContextRef.current, "processor");
        processorRef.current = processor;

        // 🔄 FIXED: Send audio chunks via worklet port
        processor.port.onmessage = (event) => {
          const base64 = event.data;
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ audio_data: base64 }));
          }
        };

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);
      };

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        // 🔄 FIXED: Proper handling for partial & final text
        if (data.text) {
          setText((prev) => prev + " " + data.text);
          console.log("🎧 Transcribed:", data.text);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };

      ws.onclose = () => {
        console.warn("🛑 WebSocket closed — stopping mic...");
        setIsConnected(false);

        // 🧹 FIXED: Proper cleanup without repeating close()
        if (processorRef.current) {
          processorRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
          audioContextRef.current.close();
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };
    } catch (err) {
      console.error("Error initializing AssemblyAI Realtime:", err);
    }
  };

  // 🔄 FIXED: Add Start/Stop buttons to control mic
  const stopStreaming = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    setIsConnected(false);
  };

  useEffect(() => {
    return () => stopStreaming(); // cleanup on unmount
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙️ Live Speech-to-Text (AssemblyAI Universal Streaming)</h2>

      <div style={{ marginTop: 20 }}>
        {!isConnected ? (
          <button
            onClick={connectAssemblyAI}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
          >
            🎤 Start Listening
          </button>
        ) : (
          <button
            onClick={stopStreaming}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              background: "tomato",
              color: "white",
            }}
          >
            🛑 Stop Listening
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 30,
          background: "#f7f7f7",
          borderRadius: 8,
          padding: 20,
          minHeight: 200,
          whiteSpace: "pre-wrap",
          fontSize: 16,
        }}
      >
        {text || "Start speaking to see live transcription..."}
      </div>
    </div>
  );
};

export default AssemblyAiLive;
