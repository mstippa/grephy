// this file contains all the action creators
// action creators happen when an event occurs
// they return actions

import fs from 'fs';

// returns the plain text of a file
// gets called from the File component
export function fileUpload(file) {
	return {
		type: 'FILE_UPLOAD',
		payload: file
	}

}

// returns an array that represents the transition function
// gets called from the Regex component
export function transitionFunction(transitions) {
	return {
		type: 'TRANSITIONS',
		payload: transitions
	}
}