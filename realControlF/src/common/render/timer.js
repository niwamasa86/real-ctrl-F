const timer = (canvas, leftTime, center = {}) => {
	const context = canvas.getContext('2d')
	const leftSec = Math.ceil(leftTime / 1000)
	context.clearRect(0, 0, canvas.width, canvas.height)

	const fontSize = canvas.height / 3
	context.beginPath()
	context.font = '400 ' + fontSize + 'px Unknown Font, sans-serif'
	context.strokeStyle = 'rgb(51, 50, 52)'
	context.fillStyle = 'rgb(250, 250, 250)'
	context.textAlign = 'center'
	context.fillText(leftSec, center.x || canvas.width / 2, (center.y || canvas.height / 2) + fontSize / 3)
}

export {
	timer
}
