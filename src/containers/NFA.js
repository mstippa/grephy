// this component displays the NFA using the vis module
// it gets passed the NFA application state which is an array containing an object that represents a state at each index

import React, { Component } from 'react';
import { connect } from 'react-redux';
import vis from 'vis';

var acceptingState = false;

class NFA extends Component {

	// creates a vis network using the NFA
	renderNFA() {
		var states = []; // initialize an array that will hold states
		var transitions = []; // initialize an array for transitions
		var NFA = this.props.NFA; 
		var i = 0;		
		var globalCounter = 0;		
		var len = NFA.length;
		for(; i < len; i++) { // loop through all the elements(states) in the NFA
			console.log(i + " pppppasdfasdf");
			if (NFA[i]) {				
				states[i] = {"id": i};
				states[i]["label"] = `${i}`;			
				var state = NFA[i];
				var transitionArray;
				for (transitionArray in state) { // loop through all transitions for a state
					var j = 0;
					var numTransitions = state[transitionArray].length;
					for(; j < numTransitions; j++) { // loop through all transitions for a state for a specific character
						transitions[globalCounter] = {"from" : i };
						transitions[globalCounter]["to"] = state[transitionArray][j];
						transitions[globalCounter]["label"] = transitionArray;
						console.log(transitionArray);
					}								
					globalCounter++;
				}
			} else {
				console.log("I am oenis bo")
				states[i] = {"id" : i};
				states[i]["label"] = '@';
				acceptingState = true;
			}	
		}
		if (!acceptingState) { // if no accepting state
			if (this.props.acceptedState !== i-1) { 
				states[i] = {"id" : this.props.acceptedState};
				states[i]["label"] = '@';
			}		
		}	

	    var container = document.getElementById('nfa');

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
		if (this.props.NFA === null) { // if NFA has not been created yet
			return (
				<div>
					<h1>NFA</h1>
					<div id="nfa"></div>
				</div>	
			);
		} else {
			this.renderNFA(); 
		return (
				<div>
					<h1>NFA</h1>
					<div id="nfa"></div>
				</div>	
			);
		}
	}
}

function mapStateToProps(state) {
	if (state.NFA === null) return {NFA: null}
	return {
		NFA: state.NFA,
		acceptedState: state.acceptedState
	}
} 

export default connect(mapStateToProps)(NFA);