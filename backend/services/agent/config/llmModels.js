import "dotenv/config"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    maxTokens: 8192
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash"
})

const openrouter = new ChatOpenRouter({
    model: "openrouter/free",
    temperature: 0,
    maxTokens: 8000
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding":
            return groq;
        case "imageAnalyzer":
            return gemini;
        default:
            return groq;
    }
}