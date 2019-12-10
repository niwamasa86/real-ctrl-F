import Canvas from '../../common/canvas'
import { zoomRender, zoomWhiteRender } from './zoomRender'

export default function(data, effect = {}, center = {}) {
	effect.time = effect.time || 3300
	const startTime = Date.now()
	return new Promise((resolve) => {
		if(data.results.length == 0 || data.results[0].length == 0) {
			resolve()
			return
		}
		Canvas.render('zoom', (next, canvas) => {
			center.x = center.x || (canvas.width / 2)
			center.y = center.y || (canvas.height / 2)
			const progress = (Date.now() - startTime) / effect.time
			if(progress < 1) {
				zoomRender(canvas, data, center, progress)
				next()
			} else {
				zoomRender(canvas, data, center, 1)
				resolve()
			}
		})
		Canvas.render('over', (next, canvas) => {
			const progress = (Date.now() - startTime) / effect.time
			if(progress < 1) {
				zoomWhiteRender(canvas, data, center, progress)
				next()
			} else {
				zoomWhiteRender(canvas, data, center, 1)
				resolve()
			}
		})
	})
}
