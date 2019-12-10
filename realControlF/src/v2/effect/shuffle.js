import Canvas from '../../common/canvas'
import Render from '../../common/render'
import Random from '../../common/random'

export default function(data, effect) {
	const shuffleTime = effect.time || 4230
	const fadeTime = shuffleTime / 7 // 全体の抽選時間に対して
	const displayDuration = 60
	const commonQuery = {
		entry: data.entry,
		displayRatio: data.displayRatio
	}
	const shuffleList = Random.random(data.entry.length).shuffle
	const startTime = Date.now()
	return new Promise((resolve, reject) => {
		Canvas.render('face', (next, canvas) => {
			const count = Math.floor((Date.now() - startTime) / displayDuration % shuffleList.length)
			const fade = Date.now() - startTime < fadeTime ? (Date.now() - startTime) / fadeTime : 1.0

			Render.faceSpot(canvas, Object.assign(commonQuery, {
				select: shuffleList[count],
				dark: fade * 0.5
			}))
			if(Date.now() - startTime < shuffleTime) {
				next()
			} else {
				if(effect.showResult) {
					if(data.results.length >= 1 && data.results[0].length >= 1) {
						Render.faceSpot(Canvas.get('face'), Object.assign(commonQuery, {
							select: data.results[0][0],
							dark: 0.5
						}))
					} else {
						Render.noFace(Canvas.get('face'))
						setTimeout(() => {
							reject()
						}, 2000)
					}
					setTimeout(() => {
						Render.clear(canvas)
						resolve()
					}, 500)
				} else{
					setTimeout(() => {
						Render.clear(canvas)
						resolve()
					}, 200)
				}
			}
		})
	})
}
