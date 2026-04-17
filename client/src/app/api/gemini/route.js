import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(req) {
    const {prompt} = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model_name = process.env.GEMINI_MODEL_NAME;
    const model =  genAI.getGenerativeModel({
        model : model_name
    })

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return Response.json({
        text : response.text()
    });
}