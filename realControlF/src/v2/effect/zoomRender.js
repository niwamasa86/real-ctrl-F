const zoomRender = (canvas, data, center, progress) => {
	const person = data.entry[data.results[0][0]]
	const top = person.faceRectangle.top
	const left = person.faceRectangle.left
	const width = person.faceRectangle.width
	const height = person.faceRectangle.height
	const displayRatio = data.displayRatio
	const originCenter = {
		x: center.x / displayRatio,
		y: center.y / displayRatio
	}
	const context = canvas.getContext('2d')
	context.clearRect(0, 0, canvas.width, canvas.height)

	// sin -1 ~ 1 → 0 ~ 1
	const sinProgress = (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2
	const maxScale = Math.min(canvas.width / (width * 2.25), canvas.height / (height * 2.25))
	const rate = (maxScale - displayRatio) * sinProgress + displayRatio
	const faceCx = left + width / 2
	const faceCy = top + height / 2
	const diffX = faceCx - originCenter.x
	const diffY = faceCy - originCenter.y
	const reverseRate = 1 - (rate - displayRatio) / (maxScale - displayRatio)
	const transX = -diffX * rate + diffX * displayRatio * reverseRate - originCenter.x * (rate - displayRatio)
	const transY = -diffY * rate + diffY * displayRatio * reverseRate - originCenter.y * (rate - displayRatio)
	context.save()
	context.beginPath()
	context.translate(transX, transY)
	context.scale(rate, rate)
	if(data.origin) context.drawImage(data.origin, 0, 0)
	context.restore()

	// 最初は少し暗くする
	if (progress < 0.3) {
		const dark = 0.5 - progress / 0.3 * 0.5
		context.fillStyle = 'rgba(0,0,0, ' + dark + ')'
		context.fillRect(0, 0, canvas.width, canvas.height)
	}
}

const zoomWhiteRender = (canvas, data, center, progress) => {
	const person = data.entry[data.results[0][0]]
	// 最後にぼやっと白い円で囲む
	if (progress > 0.8) {
		const width = person.faceRectangle.width
		const height = person.faceRectangle.height
		const maxScale = Math.min(canvas.width / (width * 2.25), canvas.height / (height * 2.25))
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)

		// 全体を白く
		const darkLevel = 0.4 - (1 - progress) / 0.2 * 0.4
		context.fillStyle = 'rgba(219,219,219, ' + darkLevel + ')'
		context.fillRect(0, 0, canvas.width, canvas.height)

		// 半径は顔の最大サイズ
		const r = Math.sqrt(width * width + height * height) / 2 * 2.0 * maxScale
		const cx = canvas.width / 2
		const cy = canvas.height / 2
		const radialGradient = context.createRadialGradient(cx, cy, 1, cx, cy, r)
		radialGradient.addColorStop(0, 'rgba(255,255,255,1)')
		radialGradient.addColorStop(.8, 'rgba(255,255,255,1)')
		radialGradient.addColorStop(1, 'rgba(0,0,0,0)')
		context.save()
		context.beginPath()
		context.globalCompositeOperation = 'destination-out'
		context.fillStyle = radialGradient
		context.arc(cx, cy, r, 0, Math.PI * 2, false)
		context.fill()
		context.closePath()
		context.restore()
	}
}

const isCanvas = (canvas) => {
	return (canvas && canvas.getContext) ? true : false
}

export {
	zoomRender,
	zoomWhiteRender
}
