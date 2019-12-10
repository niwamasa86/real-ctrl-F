const debug = require('debug')('server:v2/condition')
const Filter = require('./filter')

module.exports = (entry, condition, variables) => {
	if(!condition) return true
	debug(condition)

	if(typeof condition.min == 'number') {
		if(entry.length < condition.min) {
			return false
		}
	}
	if(typeof condition.max == 'number') {
		if(entry.length > condition.max) {
			return false
		}
	}
	if(condition.filters) {
		return condition.filters.every((obj) => {
			const _entry = Filter(entry, obj.filter, variables)
			if(typeof obj.min == 'number') {
				if(_entry.length < obj.min) {
					return false
				}
			}
			if(typeof obj.max == 'number') {
				if(_entry.length > obj.max) {
					return false
				}
			}
			return true
		})
	}
	return true
}
