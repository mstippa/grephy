// this file contains all the action creators
// action creators happen when an event occurs
// they return actions

// returns the plain text of a file
// gets called from the File component
export function fileUpload(file) {
	return {
		type: 'FILE_UPLOAD',
		payload: file
	}

}

export function acceptedLinesAction(acceptedLines) {
	return {
		type: 'ACCEPTED_LINES',
		payload: acceptedLines
	}
}

// // returns an array that represents the transition function
// // gets called from the Regex component
// export function transitionFunction(transitions) {
// 	return {
// 		type: 'TRANSITIONS',
// 		payload: transitions
// 	}
// }

// // returns true if the regex contains a carrot
// // called from the regex componenet
// export function carrot(boolean) {
// 	return {
// 		type: 'CARROT',
// 		payload: boolean
// 	}
// }

// // returns true if the regex contains a eof marker
// // called from the regex component
// export function eof(boolean) {
// 	return {
// 		type: 'EOF',
// 		payload: boolean
// 	}
// }

// // returns the accepting state which is the index into the transtion array
// // called from the regex component
// export function acceptingState(state) {
// 	return {
// 		type: 'ACCEPTING_STATE',
// 		payload: state
// 	}
// }