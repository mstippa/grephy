export default function (state = null, action) {
	switch(action.type) {
		case 'ACCEPTED_LINES' :
			return action.payload;	
	}
	return state;
}