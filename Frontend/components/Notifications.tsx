'use client'
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import api from '../lib/api'
interface Notification { id: number; title: string; message: string }
export default function Notifications() {
  const { user } = useAuth()
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  useEffect(() => {
    if (user) api.get('/notifications').then(res => setNotifs(res.data)).catch(() => { })
  }, [user])
  if (!user) return null
  return (
    <>
      <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifs.length} color="error"><Bell size={20} /></Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {notifs.length === 0 ? <MenuItem>No New Notifications</MenuItem> : notifs.map((n) => (<MenuItem key={n.id} onClick={() => setAnchorEl(null)}><div><Typography variant="subtitle2" className="font-bold">{n.title}</Typography><Typography variant="caption">{n.message}</Typography></div></MenuItem>))}
      </Menu>
    </>
  )
}