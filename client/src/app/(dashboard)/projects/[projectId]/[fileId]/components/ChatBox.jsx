"use client";

import axios from "axios";
import { useState , useEffect , useRef} from "react";

export default function ChatBox() {
    const [messages , setMessages] = useState([]);
    const [input , setInput] = useState("what is the higest temparature recorded in the andhra pradesh");
    const [loading , setLoading] = useState(false);
    const messageEndRef = useRef(null);


    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behaviour : "smooth"})
    } , [messages])

    const sendMessage = async () => {
        if(!input.trim() || loading) return;  
        const prompt = input;
        console.log("sending the message" , prompt);
        const user_message = {role : "user" , text : prompt};
        setMessages((prev)=>[...prev , user_message])
        setInput("");
        
        try {
            setLoading(true);
            const res = await axios.post("/api/gemini" , {
                prompt
            })            
            const bot_message = {role : "bot" , text : res.data.text};
            setMessages((prev)=>[...prev , bot_message]);
        } catch (error) {
            console.error("Error message : " ,error);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") { 
            e.preventDefault();
            sendMessage();
        }
    }

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-gray-200">
      <div className="px-4 py-3 border-b border-[#2f3438] bg-[#151922]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-gray-100">AI Assistant</h2>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
            Connected
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#2f3438] bg-[#14181f] p-3 text-xs leading-5 text-gray-400">
            Ask anything about your code or project context. Responses will appear here.
          </div>
        )}
        {messages.map((msg , i)=>(
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[92%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-[#1b1f2a] border border-[#2f3438] text-gray-200"
                  }`}
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                    {msg.role}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  <div ref={messageEndRef} />
                </div>
            </div>
        ))}
      </div>
      <div className="border-t border-[#2f3438] bg-[#151922] p-3">
        <input
          type="text"
          value={input}
          onChange={(e)=>{setInput(e.target.value)}}
          onKeyDown={handleKeyDown}
          placeholder="Ask the assistant..."
          className="mb-2 w-full rounded-md border border-[#323844] bg-[#0f1115] px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
     
    </div>
  );
}