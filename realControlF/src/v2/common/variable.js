exports.inputs = (inputs) => {
	if(!Array.isArray(inputs)) {
		return []
	}
	return inputs.map((input) => {
		return {
			key: input.key,
			entity: input.entity || false,
			value: input.value,
			name: input.name
		}
	})
}

exports.variable = (variable) => {
	if(!Array.isArray(variable)) {
		return []
	}
	return variable.map((key) => {
		return {
			key: key,
			entity: true,
			value: key
		}
	})
}

exports.map = (map) => {
	if(!map) {
		return []
	}
	const variable = []
	for(const key in map) {
		variable.push({
			key: key,
			entity: false,
			value: map[key],
			name: map[key]
		})
	}
	return variable
}

exports.default = () => {
	return [{
		key: 'random',
		value: Math.random()
	}]
}

exports.update = (key, value, variables) => {
	const index = variables.findIndex((variable) => variable.key === key)
	if(index >= 0) {
		variables[index].value = value
		variables[index].name = value
	}else {
		variables.push({
			key: key,
			value: value,
			name: value
		})
	}
}
