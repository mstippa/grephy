// this component does the DFA computation on the input file and displays the accepted lines
// it gets passed the "text" of the input file and the transitions array from regex.js


import React, { Component } from 'react';
import { connect } from 'react-redux';

class OutputBox extends Component {
	render() {

		if (this.props.regexData === null) {
			return (
			<div>
				<h1>Output</h1>
				<output>Penis</output>
			</div>	
			);
		}	

		return (
			<div>
				<h1>Output</h1>
				<output>Poop</output>
			</div>	
		);
	}
}

// this maps application state to this component
// index.js in the reducers folder passes the state object along
function mapStateToProps(state) {
	if (state.regexData === null) return {regexData: null}
	return {
		file: state.input, // the input
		transitionFunction: state.regexData.transitionFunction, // the transition function
		carrot: state.regexData.carrot, // true if the regex contains a carrot
		eof: state.regexData.eof, // true if the regex contains a $
		acceptingState: state.regexData.acceptingState // that accepting state
	}
}

export default connect(mapStateToProps)(OutputBox);