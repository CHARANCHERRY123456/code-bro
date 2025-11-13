"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function JoinInvitePage() {
  const { token } = useParams();
  const [status, setStatus] = useState("Joining...");

  useEffect(() => {
    if (!token) return;
    api.post(`/invite/${token}/join`, { token })
      .then(() => setStatus("Joined!"))
      .catch(() => setStatus("Invalid or expired invite."));
  }, [token]);

  return <div className="p-8 text-center">{status}</div>;
}
