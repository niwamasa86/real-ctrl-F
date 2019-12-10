const debug = require('debug')('server:v2/value')
const Entity = require('./entity')
const evalCalculation = require('./evalCalculation')

module.exports = (_value, person, variables) => {
	let value = _value
	if(typeof value != 'string') return Math.random

	variables.forEach((variable) => {
		if(variable.entity && person) variable._value = Entity.get(person, variable.value)
		else variable._value = variable.value
	})

	variables.filter((variable) => variable.entity).forEach((variable) => {
		value = value.split('${'+variable.key+'}').join(variable._value)
	})

	variables.filter((variable) => !variable.entity).forEach((variable) => {
		value = value.split('${'+variable.key+'}').join(variable._value)
		value = value.split(variable.key).join(variable._value)
	})

	try{
		return evalCalculation(value)
	}catch(e) {
		debug('Error.evalCalculation')
		return Math.random()
	}
}
