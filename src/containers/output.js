// this component displays the accepted lines
// it gets passed the acceptedLines application state which is an array that contains the accepted lines of the input file


import React, { Component } from 'react';
import { connect } from 'react-redux';

class OutputBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startIndex: 0, // the starting index of a line in the file
			curIndex: 0 // the current index in the file
		}
	}

	renderLines() {
		return this.props.acceptedLines.map((line) => {
			return (
				<p key={line}>
					{line}
				</p>
			);
		});
	}

	render() {
		if (this.props.acceptedLines === null) { // if user hasn't submitted the form yet
			return (
			<div>
				<h1>Output</h1>
				<output>
					<p>LaLaLa</p>
				</output>
			</div>	
			);
		} else {
			return (
			<div>
				<h1>Output</h1>
				<output>{this.renderLines()}</output>
			</div>	
			);
		}	
	}
}

// this maps application state to this component
// index.js in the reducers folder passes the state object along
function mapStateToProps(state) {
	if (state.acceptedLines === null) return {acceptedLines: null}
	return {
		acceptedLines: state.acceptedLines // array that holds the accepted lines
	}
}

export default connect(mapStateToProps)(OutputBox);