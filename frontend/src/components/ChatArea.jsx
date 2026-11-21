import React, { useEffect } from 'react'
import Nav from './Nav'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import { useDispatch, useSelector } from 'react-redux'
import getMessages from "../features/getMessages"
import { setArtifacts, setMessages } from "../redux/messageSlice"

function ChatArea() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const dispatch = useDispatch()

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation?._id) {
        if (selectedConversation.title === "New Chat") return
        try {
          const data = await getMessages(selectedConversation._id)
          if (Array.isArray(data)) {
            dispatch(setMessages(data))
            const latestArtifactsMessage = [...data]
              .reverse()
              .find(msg => msg?.artifacts && msg.artifacts.length > 0)
            dispatch(setArtifacts(latestArtifactsMessage?.artifacts || []))
          }
        } catch (err) {
          console.error("Failed to load messages:", err)
        }
      }
    }

    getMesg()
  }, [selectedConversation?._id, dispatch])

  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea