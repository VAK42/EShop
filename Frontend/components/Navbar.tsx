'use client'
import { AppBar, Toolbar, IconButton, Badge, Menu as MuiMenu, MenuItem, Button, Avatar, Tooltip } from '@mui/material'
import { ShoppingCart, User, LogOut, Moon, Sun, Store, Package, ChevronDown } from 'lucide-react'
import SearchWithSuggestions from '../components/SearchWithSuggestions'
import Notifications from '../components/Notifications'
import { useThemeContext } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import Link from 'next/link'
export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const { toggleTheme, mode } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [catEl, setCatEl] = useState<null | HTMLElement>(null)
  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTheme()
  }
  return (
    <AppBar
      position="sticky"
      color="transparent"
      className="glass z-50 top-4 w-full"
      elevation={0}
    >
      <Toolbar className="flex justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-violet-600 to-pink-500 dark:from-green-400 dark:to-emerald-600 bg-clip-text text-transparent no-underline shrink-0">
          <Store className="text-violet-600 dark:text-green-400" />E-Shop
        </Link>
        <div className="hidden md:flex items-center gap-1 bg-white/10 dark:bg-black/20 p-1 rounded-full backdrop-blur-sm">
          <Link href="/shop"><Button className="text-gray-700 dark:text-gray-200 hover:bg-white/20 rounded-full px-6">Shop</Button></Link>
          <Button
            className="text-gray-700 dark:text-gray-200 hover:bg-white/20 rounded-full px-6"
            endIcon={<ChevronDown size={16} />}
            onClick={(e) => setCatEl(e.currentTarget)}
          >
            Categories
          </Button>
          <MuiMenu anchorEl={catEl} open={Boolean(catEl)} onClose={() => setCatEl(null)} PaperProps={{ className: 'glass mt-2 rounded-xl' }}>
            <Link href="/shop?cat=electronics"><MenuItem onClick={() => setCatEl(null)}>Electronics</MenuItem></Link>
            <Link href="/shop?cat=fashion"><MenuItem onClick={() => setCatEl(null)}>Fashion</MenuItem></Link>
            <Link href="/shop?cat=home"><MenuItem onClick={() => setCatEl(null)}>Home & Living</MenuItem></Link>
          </MuiMenu>
          <Link href="/coupons"><Button className="text-gray-700 dark:text-gray-200 hover:bg-white/20 rounded-full px-6">Coupons</Button></Link>
          {user?.role === 'admin' && <Link href="/admin"><Button color="secondary" className="rounded-full px-6">Admin</Button></Link>}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <SearchWithSuggestions />
          </div>
          <Tooltip title={mode === 'light' ? 'Switch To Dark Mode' : 'Switch To Light Mode'}>
            <IconButton onClick={handleThemeToggle} className="bg-white/20 dark:bg-black/20 hover:scale-110 transition">
              {mode === 'light' ? <Sun size={20} className="text-orange-500" /> : <Moon size={20} className="text-violet-400" />}
            </IconButton>
          </Tooltip>
          <Notifications />
          <Link href="/cart">
            <IconButton className="bg-white/20 dark:bg-black/20 hover:scale-110 transition">
              <Badge badgeContent={items.length} color="primary">
                <ShoppingCart size={20} />
              </Badge>
            </IconButton>
          </Link>
          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} className="p-0 border-2 border-white/30 ml-2">
                <Avatar sx={{ bgcolor: mode === 'light' ? '#8b5cf6' : '#10b981' }}>{user.name[0]}</Avatar>
              </IconButton>
              <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ className: 'glass mt-2 rounded-xl' }}>
                <Link href="/profile">
                  <MenuItem onClick={() => setAnchorEl(null)} className="font-semibold">
                    <User className="mr-2" size={18} /> Profile
                  </MenuItem>
                </Link>
                <Link href="/profile">
                  <MenuItem onClick={() => setAnchorEl(null)} className="font-semibold">
                    <Package className="mr-2" size={18} /> My Orders
                  </MenuItem>
                </Link>
                <MenuItem onClick={() => { setAnchorEl(null); logout() }} className="text-red-500 font-semibold">
                  <LogOut size={18} className="mr-2" /> Logout
                </MenuItem>
              </MuiMenu>
            </>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link href="/auth/login"><Button variant="text" color="inherit" className="font-bold">Login</Button></Link>
              <Link href="/auth/register"><Button variant="contained" className="rounded-full px-6 shadow-lg bg-gradient-to-r from-violet-600 to-pink-600 dark:from-green-500 dark:to-emerald-600">Get Started</Button></Link>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  )
}