import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Use the correct streaming-supported model
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });

export async function getGeminiReply(prompt) {
  try {
    console.log("🟢 Prompt sent to Gemini:", prompt);

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let finalText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) finalText += text;
    }

    console.log("🟢 Gemini reply:", finalText);
    return finalText;
  } catch (err) {
    console.error("🔴 Gemini API error:");
    if (err.response && err.response.text) {
      const errorText = await err.response.text();
      console.error("🔴 Error Text from Gemini:", errorText);
    } else {
      console.error(err.message || err);
    }
    return "Sorry, there was an error generating the response.";
  }
}
