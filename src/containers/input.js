// this component represents the output of the input file that a user will call the regex on
// it gets passed the "text" of the input file


import React, { Component } from 'react';
import { connect } from 'react-redux';

class InputBox extends Component {
	render() {

		// if user has not chosen a file yet
		if (!this.props.inputText) {
			return (
				<output></output>
			);
		}

		return (
			<output>{this.props.inputText}</output>
		);
	}
}

// this maps application state to this component
// index.js in the reducers folder passes the state object along
function mapStateToProps(state) {
	if (state.input === null) return {inputText: ""}
	return {
		inputText: state.input
	}
}

export default connect(mapStateToProps)(InputBox);