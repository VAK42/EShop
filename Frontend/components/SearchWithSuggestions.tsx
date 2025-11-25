'use client'
import { TextField, Autocomplete, InputAdornment } from '@mui/material'
import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../lib/api'
export default function SearchWithSuggestions() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue] = useDebounce(inputValue, 300)
  useEffect(() => {
    let active = true
    if (debouncedValue === '') {
      const timer = setTimeout(() => setOptions([]), 0)
      return () => clearTimeout(timer)
    }
    api.get(`/search/suggest?q=${debouncedValue}`).then((res) => {
      if (active) {
        let newOptions: string[] = []
        if (res.data) {
          newOptions = res.data
        }
        setOptions(newOptions)
      }
    }).catch(() => setOptions([]))
    return () => { active = false }
  }, [debouncedValue])
  return (
    <Autocomplete
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      options={options}
      slotProps={{
        paper: {
          className: 'glass mt-2 rounded-xl border border-white/20',
          sx: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
          }
        }
      }}
      onChange={(event, value) => {
        if (value) {
          router.push(`/shop?q=${value}`)
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search Products..."
          size="small"
          className="w-64"
          variant="outlined"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} className="text-gray-500" />
                </InputAdornment>
              ),
              className: 'bg-white/50 dark:bg-black/20 rounded-full px-2 backdrop-blur-sm',
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue) {
              router.push(`/shop?q=${inputValue}`)
              setOpen(false)
            }
          }}
        />
      )}
    />
  )
}