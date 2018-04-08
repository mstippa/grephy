export default function (state = null, action) {
	switch(action.type) {
		case 'FILE_UPLOAD' :
			return action.payload;
	}
	return state;
}