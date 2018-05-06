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

// retuns the array that contains the accepted lines of the input file at each index
export function acceptedLinesAction(acceptedLines) {
	return {
		type: 'ACCEPTED_LINES',
		payload: acceptedLines
	}
}

export function submitNFA(NFA) {
	return {
		type: 'NFA',
		payload: NFA
	}
}

export function submitDFA(DFA) {
	return {
		type: 'DFA',
		payload: DFA
	}
}

export function submitAcceptedState(state) {
	return {
		type: 'ACCEPTED_STATE',
		payload: state
	}
}
