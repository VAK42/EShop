'use client'
import { Paper, TextField, IconButton } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { io, Socket } from 'socket.io-client'
import { wsUrl } from '../lib/api'
export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ type: string, text: string }[]>([])
  const [input, setInput] = useState('')
  const socket = useRef<Socket | null>(null)
  useEffect(() => {
    if (open && user && !socket.current) {
      const token = localStorage.getItem('accessToken')
      socket.current = io(wsUrl, { extraHeaders: { Authorization: `Bearer ${token}` } })
      socket.current.on('connect', () => console.log('Connected To Chat Gateway'))
      socket.current.on('Message', (data) => setMsgs(prev => [...prev, data]))
      socket.current.on('Exception', (err) => console.error('Socket Error:', err))
    }
    return () => { if (!open && socket.current) { socket.current.disconnect(); socket.current = null } }
  }, [open, user])
  const send = () => {
    if (!input.trim() || !socket.current) return
    const payload = { type: 'Echo', text: input }
    socket.current.emit('Message', payload)
    setMsgs(prev => [...prev, { type: 'Me', text: input }])
    setInput('')
  }
  if (!user) return null
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <Paper className="w-80 h-96 mb-4 flex flex-col p-4" elevation={6}>
              <div className="flex justify-between mb-2 border-b pb-2">
                <span className="font-bold">Support Chat</span>
                <X size={20} className="cursor-pointer" onClick={() => setOpen(false)} />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 p-2">
                {msgs.map((m, i) => (
                  <div key={i} className={`p-2 rounded max-w-[80%] text-sm ${m.type === 'Me' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-100'}`}>{m.text}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <TextField size="small" fullWidth value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type A Message..." />
                <IconButton color="primary" onClick={send}><Send size={18} /></IconButton>
              </div>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setOpen(!open)} className="bg-blue-600 text-white p-4 rounded-full shadow-lg"><MessageCircle size={24} /></motion.button>
    </div>
  )
}