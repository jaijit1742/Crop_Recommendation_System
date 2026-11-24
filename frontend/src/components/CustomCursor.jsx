import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    let mouseX = 0, mouseY = 0
    let curX = 0, curY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const animate = () => {
      curX += (mouseX - curX) * 0.1
      curY += (mouseY - curY) * 0.1
      cursor.style.left = curX + 'px'
      cursor.style.top = curY + 'px'
      requestAnimationFrame(animate)
    }

    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor="expand"]')
      if (target) {
        cursor.classList.add('cursor-expanded')
      } else {
        cursor.classList.remove('cursor-expanded')
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  )
}
