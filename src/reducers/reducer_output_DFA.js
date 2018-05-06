export default function (state = null, action) {
	switch (action.type) {
		case 'DFA' :
			return action.payload;
	}
	return state	
}		