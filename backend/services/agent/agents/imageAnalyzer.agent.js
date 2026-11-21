import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs/promises";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAnalyzer = async (state) => {
    try {
        const llm = new ChatOpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            configuration: {
                baseURL: "https://openrouter.ai/api/v1",
            },
            model: "openrouter/free",
            temperature: 0.2,
        });

        const imageBuffer = await fs.readFile(state.file.path);
        const base64Image = imageBuffer.toString("base64");

        const messages = [
            new SystemMessage(
                `You are Synaptra AI image analyzer Agent.
                
Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.
`
            ),

            new HumanMessage(
                {
                    content: [
                        {
                            type: "text",
                            text: state.prompt || "analyze the image"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${state.file.mimetype};base64,${base64Image}`
                            }
                        }
                    ]
                }
            )
        ];

        const response = await llm.invoke(messages);
        await deductCredits(state.userId, "vision");
        return {
            ...state,
            aiResponse: response.content
        };

    } catch (error) {
        console.log(error);
        return {
            ...state,
            aiResponse: `Failed to analyze file: ${error?.message || "Unknown error"}`
        };
    } finally {
        if (state?.file?.path) {
            await fs.unlink(state.file.path).catch(() => {});
        }
    }
};