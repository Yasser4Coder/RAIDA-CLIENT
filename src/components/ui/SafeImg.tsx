import { type ImgHTMLAttributes } from 'react'
import { safeImageSrc } from '../../lib/safe'

type SafeImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  fallback?: string
}

export default function SafeImg({ src, fallback = '', alt = '', ...props }: SafeImgProps) {
  const safe = safeImageSrc(src, fallback)
  if (!safe) return null
  return <img {...props} src={safe} alt={alt} />
}
