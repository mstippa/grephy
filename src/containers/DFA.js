// this component displays the DFA using the vis module
// it gets passed the NFA application state which is an array containing an object that represents a state at each index

import React, { Component } from 'react';
import { connect } from 'react-redux';
import vis from 'vis';

var acceptingState = false;

class DFA extends Component {

	// creates a vis network using the NFA
	renderDFA() {
		var states = []; // initialize an array that will hold states
		var transitions = []; // initialize an array for transitions
		var DFA = this.props.DFA; 
		var i = 0;		
		var globalCounter = 0;		
		var len = DFA.length;
		for(; i < len; i++) { // loop through all the elements(states) in the NFA
			if (DFA[i]) {				
				states[i] = {"id": i};
				states[i]["label"] = `${i}`;	
				transitions[globalCounter] = {"from": i};
				transitions[globalCounter]["to"] = 100; // error state		
				globalCounter++;
				var state = DFA[i];
				var transitionArray;
				for (transitionArray in state) { // loop through all transitions for a state
					var j = 0;
					var numTransitions = state[transitionArray].length;
					for(; j < numTransitions; j++) { // loop through all transitions for a state for a specific character
						transitions[globalCounter] = {"from" : i };
						transitions[globalCounter]["to"] = state[transitionArray][j];
						transitions[globalCounter]["label"] = transitionArray;
					}								
					globalCounter++;
				}
			} else {
				states[i] = {"id" : i};
				states[i]["label"] = '@';
				acceptingState = true;
			}	
		}
		if (!acceptingState) { // if no accepting state
			if (this.props.acceptedState !== i-1) { 
				states[i] = {"id" : this.props.acceptedState};
				states[i]["label"] = '@';
				states[i+1] = {"id": 100};
				states[i+1]["label"] = 'Error';
			} else {
				states[i] = {"id": 100};
				states[i]["label"] = 'Error';
			}		
		}	

	    var container = document.getElementById('dfa');

	    // provide the data in the vis format
	    var data = {
	        nodes: states,
	        edges: transitions
	    };
	    var options = {};
	    // intitalize the vis network
	    var network = new vis.Network(container, data, options);   
	}

	render() {
		if (this.props.DFA === null) { // if NFA has not been created yet
			return (
				<div>
					<h1>DFA</h1>
					<div id="dfa"></div>
				</div>	
			);
		} else {
			this.renderDFA(); 
		return (
				<div>
					<h1>DFA</h1>
					<div id="dfa"></div>
				</div>	
			);
		}
	}
}

function mapStateToProps(state) {
	if (state.DFA === null) return {DFA: null}
	return {
		DFA: state.DFA,
		acceptedState: state.acceptedState
	}
} 

export default connect(mapStateToProps)(DFA);