export default function (state = null, action) {
	switch (action.type) {
		case 'ACCEPTED_STATE' :
			return action.payload;	

	}
	return state
}	
