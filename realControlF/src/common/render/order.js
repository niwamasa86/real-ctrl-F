
const order = (canvas, query) => {
	const entry = query.entry
	const order = query.order
	const displayRatio = query.displayRatio
	const context = canvas.getContext('2d')
	context.clearRect(0, 0, canvas.width, canvas.height)

	entry.forEach((person, idx) => {
		if (typeof order[idx] == 'undefined') return
		const top = person.faceRectangle.top
		const left = person.faceRectangle.left
		const width = person.faceRectangle.width
		const height = person.faceRectangle.height
		const fontSize = Math.floor(canvas.width / 30)
		const cx = left + width / 2
		const dist = (width + height) / 2
		const x = cx * displayRatio
		const y = top * displayRatio - 2 - dist / 5

		// 顔の上部に円を描く
		context.beginPath()
		context.font = '400 ' + fontSize + 'px Unknown Font, sans-serif'
		context.strokeStyle = 'rgb(51, 50, 52)'
		context.fillStyle = 'rgba(150, 150, 150, 0.7)'
		context.arc(x, y + fontSize / 2, fontSize, 0, Math.PI * 2)
		context.fill()

		// 円の中に数値を描く
		context.beginPath()
		context.textAlign = 'center'
		context.lineWidth = 3
		context.strokeStyle = 'rgb(51, 50, 52)'
		context.fillStyle = 'rgb(250, 250, 250)'
		splitLine(context, order[idx], x, y, fontSize)
	})
}

const splitLine = (context, text, x, y, fontSize, lineHeight = 1.1618) => {
	for (let lines = String(text).split('\n'), i = 0, l = lines.length; l > i; i++) {
		const line = lines[i]
		let addY = fontSize
		if (i) addY += fontSize * lineHeight * i
		context.fillText(line, x + 0, y + addY)
	}
}

export{
	order
}
