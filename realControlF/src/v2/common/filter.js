const debug = require('debug')('server:v2/filter')
const Value = require('./value')

module.exports = (entry, filter, variables) => {
	if(!filter) return entry
	if(!filter.pass) filter.pass = 'high'

	return entry.filter((person) => {
		if(filter.pass === 'high') {
			return filter.threshold <= Value(filter.value, person, variables)
		} else if(filter.pass === 'low') {
			return filter.threshold >= Value(filter.value, person, variables)
		} else {
			return true
		}
	})
}
