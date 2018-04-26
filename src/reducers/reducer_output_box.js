export default function (state = null, action) {
	switch(action.type) {
		case 'TRANSITIONS' :
			return action.payload;
		case 'CARROT' :
			return action.payload;
		case 'EOF' : 
			return action.payload;
		case 'ACCEPTING_STATE' :
			return action.payload;		
	}
	return state;
}