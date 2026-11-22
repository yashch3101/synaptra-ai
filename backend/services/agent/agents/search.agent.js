import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js"

export const searchAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "search")
        const results = await searchTool.invoke({
            query: state.prompt
        })
        await deductCredits(state.userId, "search")
        console.log(results)

        return {
            ...state,
            searchResults: results,
            images: results.images
        }
    } catch (error) {
        console.error("Error in searchAgent:", error)
        return {
            ...state,
            searchResults: [],
            images: [],
            aiResponse: error?.data?.message || "failed to generate search response"
        }
    }
}