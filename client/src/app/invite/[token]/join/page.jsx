"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function JoinInvitePage() {
  const { token } = useParams();
  const { data: session } = useSession();
  const [status, setStatus] = useState("Joining...");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token || !session?.backendJWT) return;
    api
      .post(
        `/invite/${token}/join`,
        { token },
        { headers: { Authorization: `Bearer ${session.backendJWT}` } }
      )
      .then((res) => {
        setStatus("Success! You have been added to the project.");
        setData(res.data?.data);
      })
      .catch(() => setStatus("Invalid or expired invite."));
  }, [token, session?.backendJWT]);

  return (
    <div className="p-8 text-center">
      <div className="text-lg font-semibold mb-2">{status}</div>
      {data && (
        <div className="mt-6 inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow p-6 text-left">
          <div className="mb-2">
            <span className="font-bold">Membership ID:</span> <span className="text-blue-600">{data.id}</span>
          </div>
          <div className="mb-2">
            <span className="font-bold">Project ID:</span> <span className="text-green-700">{data.projectId}</span>
          </div>
          <div className="mb-2">
            <span className="font-bold">User ID:</span> <span className="text-purple-700">{data.userId}</span>
          </div>
          <div>
            <span className="font-bold">Joined At:</span> <span className="text-gray-700">{new Date(data.joinedAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
