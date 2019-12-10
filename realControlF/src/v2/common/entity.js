const debug = require('debug')('server:v2/entity')

exports.get = (person, entity) => {
	mapList.forEach((map) => {
		if(map.key.indexOf(entity) >= 0) {
			entity = map.root + entity
		}
	})
	const array = entity.split('.')
	array.unshift(person)
	return array.reduce(reducer)
}

const reducer = (obj, dir) => {
	return typeof obj == 'object' ? obj[dir] : {}
}

const mapList = [{
	key: ['emotion.anger','emotion.contempt','emotion.disgust','emotion.fear',
		'emotion.happiness','emotion.neutral','emotion.sadness','emotion.surprise'],
	root: 'faceAttributes.'
}, {
	key: ['anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'],
	root: 'faceAttributes.emotion.'
}, {
	key: ['smile', 'headPose', 'gender', 'age', 'facialHair', 'glasses',
		'blur',	'exposure',	'noise',	'makeup',	'accessories','occlusion','hair'],
	root: 'faceAttributes.'
}, {
	key: ['top', 'left', 'width', 'height'],
	root: 'faceRectangle.'
},{
	key: ['pupilLeft', 'pupilRight', 'noseTip', 'mouthLeft', 'mouthRight',
		'eyebrowLeftOuter','eyebrowLeftInner','eyeLeftOuter', 'eyeLeftTop','eyeLeftBottom','eyeLeftInner',
		'eyebrowRightInner','eyebrowRightOuter','eyeRightInner','eyeRightTop','eyeRightBottom','eyeRightOuter',
		'noseRootLeft','noseRootRight','noseLeftAlarTop','noseRightAlarTop','noseLeftAlarOutTip','noseRightAlarOutTip',
		'upperLipTop','upperLipBottom','underLipTop','underLipBottom'],
	root: 'faceLandmarks.'
}]
