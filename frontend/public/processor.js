class Processor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const float32Array = input[0];
      const int16Array = new Int16Array(float32Array.length);

      // 🔊 Convert Float32 → Int16
      for (let i = 0; i < float32Array.length; i++) {
        int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
      }

      // ✅ Convert Int16Array → Base64 (manual, safe for AudioWorklet)
      const bytes = new Uint8Array(int16Array.buffer);
      let binary = "";
      const chunkSize = 0x8000; // 32 KB chunks (for performance)
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }

      // ✅ Manual Base64 encode (safe replacement for btoa)
      const base64chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      let result = "";
      let padding = "";

      const byteLength = binary.length;
      for (let i = 0; i < byteLength; i += 3) {
        const c1 = binary.charCodeAt(i);
        const c2 = binary.charCodeAt(i + 1);
        const c3 = binary.charCodeAt(i + 2);

        const triple = (c1 << 16) | (c2 << 8) | c3;

        result +=
          base64chars[(triple >> 18) & 0x3f] +
          base64chars[(triple >> 12) & 0x3f] +
          (isNaN(c2) ? "=" : base64chars[(triple >> 6) & 0x3f]) +
          (isNaN(c3) ? "=" : base64chars[triple & 0x3f]);
      }

      this.port.postMessage(result);
    }
    return true;
  }
}

registerProcessor("processor", Processor);
