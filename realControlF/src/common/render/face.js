/*
	entry
	displayRatio
	[select] // entryのindex
	[dark] // 0-1,
	[opacity]: { default: 0, 3: 1.0, 4:0.7 }
 */
const random = []
for(let i=0; i<100;i++) {
	random[i] = Math.random()
}
const faceSpot = (canvas, query) => {
	const context = canvas.getContext('2d')
	const entry = query.entry
	const ring = query.ring || []
	const displayRatio = query.displayRatio || 9/16

	context.clearRect(0, 0, canvas.width, canvas.height)

	// 全体を半透明で黒く
	const dark = query.dark || 0.5
	context.fillStyle = `rgba(0,0,0, ${dark})`
	context.fillRect(0, 0, canvas.width, canvas.height)

	entry.forEach((person, idx) => {

		if (typeof query.select != 'undefined' && query.select != idx) {
			return
		}

		const top = person.faceRectangle.top
		const left = person.faceRectangle.left
		const width = person.faceRectangle.width
		const height = person.faceRectangle.height
		const cx = left + width / 2
		const cy = top + height / 2
		let opacity = 1.0
		if(query.opacity) {
			if(typeof query.opacity['default'] != 'undefined') opacity = query.opacity['default']
			if(typeof query.opacity[idx] != 'undefined') opacity = query.opacity[idx]
		}
		if(opacity <= 0) return

		// 顔円の半径
		const r = Math.sqrt(width * width + height * height) / 2 * 2.2 * displayRatio
		const x = cx * displayRatio
		const y = cy * displayRatio

		if(ring[idx]) {
			ring[idx].values.forEach((value, index) => {
				if(!ring[idx].colors || !ring[idx].colors[index]) return
				value = value * value
				const rWeight = (ring[idx].values.length - index) * 0.1
				const color = ring[idx].colors[index]
				const radialGradient = context.createRadialGradient(x, y, 1, x, y, r + r * rWeight * value)
				const red = parseInt(color.substring(1,3), 16)
				const green = parseInt(color.substring(3,5), 16)
				const blue  = parseInt(color.substring(5,7), 16)
				radialGradient.addColorStop(0, `rgba(${red},${green},${blue}, ${opacity * value})`)
				radialGradient.addColorStop(.9, `rgba(${red},${green},${blue}, ${opacity * value})`)
				radialGradient.addColorStop(1, 'rgba(0,0,0,0)')
				context.save()
				context.beginPath()
				context.globalCompositeOperation = 'source-atop'
				context.fillStyle = radialGradient
				context.arc(x, y, r + r * rWeight * value, 0, Math.PI * 2, false)
				context.fill()
				context.closePath()
				context.restore()
			})
		}

		const radialGradient = context.createRadialGradient(x, y, 1, x, y, r)
		radialGradient.addColorStop(0, `rgba(255,255,255, ${opacity})`)
		radialGradient.addColorStop(.8, `rgba(255,255,255, ${opacity})`)
		radialGradient.addColorStop(1, 'rgba(0,0,0,0)')

		context.save()
		context.beginPath()
		context.globalCompositeOperation = 'destination-out'
		context.fillStyle = radialGradient
		context.arc(x, y, r, 0, Math.PI * 2, false)
		context.fill()
		context.closePath()
		context.restore()
	})
}

const noFace = (canvas) => {
	const context = canvas.getContext('2d')
	context.fillStyle = 'rgba(30, 30, 30, 0.2)'
	context.rect(0, 0, canvas.width, canvas.height)
	context.fill()

	context.beginPath()
	context.font = '400 20px Unknown Font, sans-serif'
	context.strokeStyle = 'rgb(51, 50, 52)'
	context.fillStyle = 'rgb(250, 250, 250)'
	context.textAlign = 'center'
	context.fillText('エントリー人数が0人です', canvas.width / 2, canvas.height / 2)
}

export {
	faceSpot,
	noFace
}
