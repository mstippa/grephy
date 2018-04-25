export default function (state = null, action) {
	switch(action.type) {
		case 'TRANSITIONS' :
			return action.payload;
	}
	return state;
}