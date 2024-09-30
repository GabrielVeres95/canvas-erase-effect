'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function HomeBanner() {
	const [size, setSize] = useState({ width: 0, height: 0 })
	const canvasRef = useRef(null)
	const drawingCanvasRef = useRef(null)
	const videoRef = useRef(null)

	const resize = useCallback(() => {
		setSize({ width: window.innerWidth, height: window.innerHeight })
	}, [])

	useEffect(() => {
		resize()
		window.addEventListener('resize', resize)
		return () => window.removeEventListener('resize', resize)
	}, [resize])

	useEffect(() => {
		if (size.width === 0 || size.height === 0) return

		const renderingElement = canvasRef.current
		const drawingElement = drawingCanvasRef.current
		if (!renderingElement || !drawingElement) return

		const drawingCtx = drawingElement.getContext('2d')
		const renderingCtx = renderingElement.getContext('2d')

		renderingElement.width = drawingElement.width = size.width
		renderingElement.height = drawingElement.height = size.height

		let lastX,
			lastY,
			moving = false

		renderingCtx.globalCompositeOperation = 'source-over'
		renderingCtx.fillStyle = '#000000'
		renderingCtx.fillRect(0, 0, size.width, size.height)

		const draw = (currentX, currentY) => {
			drawingCtx.globalCompositeOperation = 'source-over'
			renderingCtx.globalCompositeOperation = 'destination-out'
			drawingCtx.lineJoin = 'round'
			drawingCtx.moveTo(lastX, lastY)
			drawingCtx.lineTo(currentX, currentY)
			drawingCtx.closePath()
			drawingCtx.lineWidth = 120
			drawingCtx.stroke()
			lastX = currentX
			lastY = currentY
			renderingCtx.drawImage(drawingElement, 0, 0)
		}

		const handleMouseMove = (ev) => {
			if (moving) {
				const currentX = ev.pageX - renderingElement.offsetLeft
				const currentY = ev.pageY - renderingElement.offsetTop
				requestAnimationFrame(() => draw(currentX, currentY))
			}
		}

		renderingElement.addEventListener('mouseover', (ev) => {
			moving = true
			lastX = ev.pageX - renderingElement.offsetLeft
			lastY = ev.pageY - renderingElement.offsetTop
		})

		renderingElement.addEventListener('mousedown', (ev) => {
			moving = true
			lastX = ev.pageX - renderingElement.offsetLeft
			lastY = ev.pageY - renderingElement.offsetTop
		})

		renderingElement.addEventListener('mouseup', () => {
			moving = false
		})

		renderingElement.addEventListener('mousemove', handleMouseMove)

		return () => {
			renderingElement.removeEventListener('mouseover', () => {})
			renderingElement.removeEventListener('mousedown', () => {})
			renderingElement.removeEventListener('mouseup', () => {})
			renderingElement.removeEventListener('mousemove', handleMouseMove)
		}
	}, [size])

	const video = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				duration: 1,
			},
		},
	}
	const container = {
		initial: { y: 800 },
		animate: {
			y: 0,
			transition: {
				staggerChildren: 0.2,
			},
		},
	}
	const item = {
		initial: { y: 800 },
		animate: {
			y: 0,
			transition: {
				duration: 1,
				ease: [0.6, 0.05, -0.01, 0.9],
			},
		},
	}

	return (
		<div className="home-banner">
			<motion.div className="video-container" variants={video} initial="initial" animate="animate" style={{ opacity: 0 }}>
				<video ref={videoRef} height="100%" width="100%" loop autoPlay muted playsInline src="/video.mp4" />
			</motion.div>
			<canvas className="canvas" ref={canvasRef} />
			<canvas ref={drawingCanvasRef} style={{ display: 'none' }} />
			<motion.div className="banner-title" variants={container} initial="initial" animate="animate">
				<motion.div className="headline" variants={item}>
					DIG
				</motion.div>
				<motion.div className="headline" variants={item}>
					DEEP
				</motion.div>
			</motion.div>
		</div>
	)
}
