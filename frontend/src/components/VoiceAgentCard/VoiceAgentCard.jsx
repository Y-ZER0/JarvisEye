import React, { useEffect, useRef } from "react";
import "./VoiceAgentCard.css";

export default function VoiceAgentCard() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scriptId = "elevenlabs-convai-widget";
    // Avoid adding multiple times
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      document.body.appendChild(script);
    }

    // Optionally cleanup if needed
    return () => {
      // you could remove the script here if desired
      // document.getElementById(scriptId)?.remove();
    };
  }, []);

  return (
    <div className="voice-agent-card" ref={containerRef}>
      <elevenlabs-convai agent-id="agent_4301k57454e2fmasa0xrpqa6a1cw"></elevenlabs-convai>
    </div>
  );
}
