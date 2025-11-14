import axios from "axios";

export async function POST(req) {
    const body = await req.json();
    console.log("Received login request with body:", body);
    const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        body : body,
    });

    const data = await res.json();
    return Response.json(data);
}