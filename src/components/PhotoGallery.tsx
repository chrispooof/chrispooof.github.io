import { useEffect, useRef } from 'react'

interface PhotoGalleryProps {
  photos: string[]
  photosId: number
}

const SCROLL_VALUE = 0.5
const INTERVAL_MS = 15

export default function PhotoGallery({ photos, photosId }: PhotoGalleryProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const widthRef = useRef(0)
  const previousScrollRef = useRef(-1)

  const makeInterval = () =>
    setInterval(() => {
      const div = divRef.current
      if (!div) return
      const total = widthRef.current
      if (photosId % 2 === 0) {
        if (div.scrollLeft !== previousScrollRef.current) {
          previousScrollRef.current = div.scrollLeft
          div.scrollTo(div.scrollLeft + SCROLL_VALUE, 0)
        } else {
          div.scrollLeft = 0
        }
      } else {
        if (div.scrollLeft !== 0) {
          div.scrollTo(div.scrollLeft - SCROLL_VALUE, 0)
        } else {
          div.scrollLeft = total
        }
      }
    }, INTERVAL_MS)

  useEffect(() => {
    const div = divRef.current
    if (!div) return

    const onLoad = () => {
      const total = [...div.children].reduce((sum, child) => sum + child.clientWidth, 0)
      widthRef.current = total
      if (photosId % 2 === 1) div.scrollLeft = total
      intervalRef.current = makeInterval()
    }

    const onMouseEnter = () => {
      if (intervalRef.current != null) clearInterval(intervalRef.current)
    }

    const onMouseLeave = () => {
      intervalRef.current = makeInterval()
    }

    window.addEventListener('load', onLoad)
    div.addEventListener('mouseenter', onMouseEnter)
    div.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('load', onLoad)
      div.removeEventListener('mouseenter', onMouseEnter)
      div.removeEventListener('mouseleave', onMouseLeave)
      if (intervalRef.current != null) clearInterval(intervalRef.current)
    }
  }, [photosId])

  return (
    <div
      ref={divRef}
      className="flex flex-row flex-nowrap overflow-x-auto"
    >
      {photos.map((photo) => (
        <img
          key={photo}
          src={photo}
          className="block w-auto h-auto max-h-[20vw] m-0.5"
          alt=""
        />
      ))}
    </div>
  )
}
