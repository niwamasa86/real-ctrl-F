
const topMessage = (canvas, text = '') => {
	const context = canvas.getContext('2d')
	// context.clearRect(0, 0, canvas.width, canvas.height)
	if(text == '') return
	const height = canvas.height / 12
	const fontSize = Math.round(height * 0.85)
	const halfWidth = text.length / 2 * fontSize

	context.fillStyle = 'rgba(230, 230, 230, 0.8)'
	drawRect(context, canvas.width / 2 - halfWidth - 10, 2, (halfWidth + 10) * 2, height, 7)
	context.fill()
	context.beginPath()
	context.textAlign = 'center'
	context.font = '400 ' + fontSize + 'px Unknown Font, sans-serif'
	context.fillStyle = 'rgb(36, 162, 183)'
	context.fillText(text, canvas.width / 2, fontSize + 2)
}

// 角丸の四角形を描画する
const drawRect = (context, x, y, width, height, radius) => {
	context.save()
	context.beginPath()
	context.moveTo(x + radius, y)
	context.lineTo(x + width - radius, y)
	context.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, 0, false)
	context.lineTo(x + width, y + height - radius)
	context.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5, false)
	context.lineTo(x + radius, y + height)
	context.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI, false)
	context.lineTo(x, y + radius)
	context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false)
	context.closePath()
	context.fill()
	context.restore()
}

export {
	topMessage
}
