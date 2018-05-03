export default function (state = null, action) {
	switch (action.type) {
		case 'DFA' :
			return action.payload;
		case 'NFA' :
			return action.payload;
	}
	return state;
}