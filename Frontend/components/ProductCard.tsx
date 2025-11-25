import { Card, CardContent, CardMedia, Typography, Button, Rating } from '@mui/material'
import { ShoppingCart, Image as ImageIcon, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import Link from 'next/link'
interface Product { id: number; title: string; price: number; imageUrl: string; rating: number; description: string }
export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [imgErr, setImgErr] = useState(false)
  return (
    <Card className="glass-card h-full flex flex-col overflow-hidden relative group border-0">
      <div className="absolute top-3 right-3 z-10">
        <Button className="min-w-0 p-2 rounded-full bg-white/20 backdrop-blur text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500">
          <Heart size={18} />
        </Button>
      </div>
      <Link href={`/product/${product.id}`} className="cursor-pointer overflow-hidden">
        {imgErr || !product.imageUrl ? (<div className="h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><ImageIcon size={48} className="text-gray-400" /></div>) : (<CardMedia component="img" height="224" image={product.imageUrl} alt={product.title} onError={() => setImgErr(true)} className="h-56 object-cover transform group-hover:scale-110 transition duration-700" />)}
      </Link>
      <CardContent className="flex-1 flex flex-col p-5">
        <div className="flex justify-between items-start mb-2">
          <Typography variant="subtitle1" className="font-bold line-clamp-1 flex-1 mr-2 text-lg">{product.title}</Typography>
          <Typography variant="h6" className="font-black text-violet-600 dark:text-green-400">${product.price}</Typography>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <span className="text-xs opacity-60">({product.rating} Stars)</span>
        </div>
        <Typography variant="body2" className="line-clamp-2 mb-4 flex-1 opacity-70 text-sm">{product.description}</Typography>
        <Button
          variant="contained"
          fullWidth
          className="rounded-xl py-3 shadow-lg shadow-violet-500/20 dark:shadow-green-500/20"
          startIcon={<ShoppingCart size={18} />}
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </Button>
      </CardContent>
    </Card>
  )
}