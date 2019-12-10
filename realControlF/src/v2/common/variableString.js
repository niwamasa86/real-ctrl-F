const Value = require('./value')

module.exports = (_string, person, variables) => {
	if(typeof string != 'string') ''
	let string = _string

	variables
		.filter((variable) => typeof variable.name != 'undefined')
		.forEach((variable) => {
			string = string.split('${'+variable.key+'}').join(variable.name)
		})

	// [  ]で囲ってある文は数値計算する
	const evalStrings = string.match(/\[((\s*?.*?)*?)\]/g)
	if(Array.isArray(evalStrings)) {
		evalStrings.forEach((evalString) => {
			const _innerString = evalString.slice(1, evalString.length - 1)
			const value = Value(_innerString, person, variables)
			string = string.replace(evalString, value)
		})
	}

	return string
}
