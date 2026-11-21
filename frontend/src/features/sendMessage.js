import api from '../../utils/axios'

async function sendMessage(payload) {
  try {
    const isFormData = payload instanceof FormData
    const { data } = await api.post("/api/agent/chat", payload, {
      timeout: 30000,
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
    })
    return data
  } catch (error) {
    console.error("API /api/agent/chat error:", error?.response?.data || error.message)
    throw error
  }
}

export default sendMessage