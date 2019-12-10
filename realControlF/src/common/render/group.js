
const group = (canvas, query) => {
	const entry = query.entry
	const groups = query.group
	const displayRatio = query.displayRatio
	const groupNames = query.groupNames
	const context = canvas.getContext('2d')
	const fontSize = Math.ceil(canvas.width / (15 + entry.length / 2.3))

	context.clearRect(0, 0, canvas.width, canvas.height)

	context.save()
	groups.forEach((group, groupIndex) => {
		group.forEach((index) => {
			const person = entry[index]
			const area = {
				top: person.faceRectangle.top,
				left: person.faceRectangle.left,
				width: person.faceRectangle.width,
				height: person.faceRectangle.height,
			}
			area.r = (area.width + area.height) / 4
			area.cx = area.width / 2 + area.left
			area.cy = area.height / 2 + area.top
			drawText(context, groupNames[groupIndex], area.cx * displayRatio, area.cy * displayRatio - area.r * displayRatio, fontSize)
		})
	})
	context.restore()
}

const drawText = (context, text, x, y, fontSize) => {
	context.beginPath()
	context.textAlign = 'center'
	context.font = '400 ' + fontSize + 'px Unknown Font, sans-serif'
	context.fillStyle = 'rgb(36, 162, 183, 0.8)'
	context.fillText(text, x, y)
}

export {
	group
}
