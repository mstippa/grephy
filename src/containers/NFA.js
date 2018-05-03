// this component displays the NFA using the vis module
// it gets passed the NFA application state which is an array containing an object that represents a state at each index

import React, { Component } from 'react';
import { connect } from 'react-redux';
import vis from 'vis';


class NFA extends Component {
	render() {
		if (this.props.NFA === null) {
			return (
				<div>
					<h1>NFA</h1>
					<div>I Like Poop</div>
				</div>	
			);
		} else {
			return (
				<div>
					<h1>NFA</h1>
					<div>PP</div>
				</div>
			);
		}

	}
}

function mapStateToProps(state) {
	if (state.automata === null) return {NFA: null}
	return {
		NFA: state.automata.NFA
	}
} 

export default connect(mapStateToProps)(NFA);