// this component does the DFA computation on the input file and displays the accepted lines
// it gets passed the "text" of the input file and the transitions array from regex.js


import React, { Component } from 'react';
import { connect } from 'react-redux';
import transitions from './regex.js';

class OutputBox extends Component {
	render() {
		console.log(this.props.transitionFunction);
		// if user has not chosen a file yet
		if (this.props.transitionFunction === null) {
			return (
				<div>
					<h1>Output</h1>
					<output>Poop</output>
				</div>	
			);
		}

		return (
			<div>
				<h1>Output</h1>
				<output>{this.props.transitionFunction}</output>
			</div>	
		);
	}
}

// this maps application state to this component
// index.js in the reducers folder passes the state object along
function mapStateToProps(state) {
	if (state.transitionFunction === null) return {transitionFunction: null}
	return {
		inputText: state.input,
		transitionFunction: state.transitionFunction
	}
}

export default connect(mapStateToProps)(OutputBox);