const uploading = (canvas, millis) => {
	const context = canvas.getContext('2d')
	const w = canvas.width
	const h = canvas.height
	const cx = w / 2
	const cy = h / 2

	context.clearRect(0, 0, canvas.width, canvas.height)

	// 撮影した瞬間のホワイトアウト
	let opacity = 0.0
	if (millis <= 500) {
		opacity = 1 - 1.0 * (millis / 500) * (millis / 500)
	}

	context.beginPath()
	context.fillStyle = 'rgba(230, 230, 230, ' + opacity + ')'
	context.rect(0, 0, canvas.width, canvas.height)
	context.fill()

	// 1ループをhead: 0-1
	const head = (millis / 4000) % 1
	context.save()

	// 白い円3つ
	for (let c = 0; c < 3; c++) {
		let hDiff = 0
		if (c == 0) hDiff = -0.08
		if (c == 2) hDiff = 0.08
		if (head < 0.5 && c == 2) hDiff = 0.12
		if (head >= 0.5 && c == 0) hDiff = -0.12

		let xDiff = 0
		if (c == 0) xDiff = 50
		if (c == 2) xDiff = -50

		let x = cx - w / 3 + xDiff
		const r = w / 1.5

		// 0.1 - 0.4で左から右へ移動
		if (head < 0.4 + hDiff) {
			// 0.3範囲を0-1に正規化
			const h = Math.max(head - 0.1 - hDiff, 0.0) / 0.3
			x += r * Math.sin(h * Math.PI / 2)
		} else if (head <= 0.5) {
			x += r
		}

		// 戻りではhDiffが逆転
		// 0.6 - 0.9で右から左へ移動
		else if (head > 0.6 - hDiff) {
			// 0.3範囲を0-1に
			const h = Math.min(head - 0.6 + hDiff, 0.3) / 0.3
			// x += r * (1 - h) * (1 - h)
			x += r - r * Math.sin(h * Math.PI / 2)
		} else {
			x += r
		}

		context.beginPath()
		context.fillStyle = 'rgba(250, 250, 250, 0.9)'
		context.arc(Math.round(x), cy, 20, 0, Math.PI * 2)
		context.fill()
	}
	context.restore()
}

export {
	uploading
}
