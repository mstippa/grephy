import React, { Component } from 'react';
import { connect } from 'react-redux';

// an array that represents the transition functions from state to state
// the index into the array represents a state
var transitions = [];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '; // all the acceptable characters

class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '',
			error: '',
			indexInRegex: 0, // the current index in the regex
			indexInTransitions: 0, // the index into the transitions array, represents state
			groupingIndex: -1, // the index that keeps track of current state when there is ()*
			curCharacter: '', // the current character in the regex
			nextCharacter: '', // the next character in the regex
		};  
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	// checks if the input is empty
	validate() {
		return (this.state.regex === '');
	}

	// creates a new transition
	// transitionType is used to decide if feedback transition or transition to a new state will be created 
	createNewTransition(transitionType) {
		var curCharacter = this.state.curCharacter; // assign the current character in the regex to a variable
		var stateTransitions = {}; // create an object that will hold all the transitions on a state
		if (transitionType == 'new') { // if the transition is to a new state
			stateTransitions.curCharacter = [this.state.indexInTransitions+1]; // creating a transition to a new state
		} else { // if the transition needs to loopback
			if (this.state.groupingIndex === -1) { // if the transition loops back to the current state
				stateTransitions.curCharacter = [this.state.indexInTransitions] // creating a transition to the current state
			} else {
				stateTransitions.curCharacter = [this.state.groupingIndex]; // creating a transition back to a previous state
				this.setState({groupingIndex: -1});
			}			
		}	
		transitions[this.state.indexInTransitions] = stateTransitions; // add the state object to the transitions table 
	}

	// updates the regex index depending on the increment argument
	updateRegexIndex(increment) {
		this.setState({indexInRegex: this.state.indexInRegex+increment});
	}

	updateTransitionsIndex() {
		this.setState({indexInTransitions: this.state.indexInTransitions+1});
	}


	getCharactersInRegex() {
		// changing the current character in the regex and passing in a callback function
		this.setState({curCharacter: this.state.regex.charAt(this.state.indexInRegex)}, () => {
			// changing the next character in the regex and passing in a callback function
			this.setState({nextCharacter: this.state.regex.charAt(this.state.indexInRegex+1)});
		});	
	}

	// recursive function that reads the regex and calls the correct production based on the current character 
	convertToNFA() {		
		if (this.state.indexInRegex === this.state.regex.length) { // if no more characters to read
			console.log(transitions);
		} else { 
			switch (curCharacter) {
				case '(':
					this.grouping();
				case ')':
					this.grouping();
				case '*':
					this.splat();
				case '|':
					this.alternator();
				case '.':
					this.period();
				case '^':
					this.carrot();
				case '$':
					this.eof();
				default:
					this.character();					
			}	
			this.convertToNFA(); // keep calling the function until the regex is deciphered
		}

	}

	// ******** Productions that get called when a specific character in regex is read ********** \\

	grouping() {
		if (this.state.curCharacter === '(') {
			this.setState({groupingIndex: this.state.indexInTransitions}); // need to remember the current state in case we'll need to loopback to it
			this.updateRegexIndex(1);
			this.getCharactersInRegex();
		} else { // then the current character is ")"
			if (this.state.nextCharacter === '*') {
				this.splat();
			}
		}
	}

	character() {
		console.log(this.state);
		if (alphabet.indexOf(this.state.nextCharacter) > -1) { // if the next character in the regex is in the alphabet
			this.createNewTransition('new'); // add a transition to a new state on the current character 
			this.updateTransitionsIndex(); // update the transitions index
			this.updateRegexIndex(1); // increase the regex index by 1
			this.getCharactersInRegex();	// get the new characters in the regex
		} else if (this.state.nextCharacter === '*') { // if the next character in the regex is the splat symbol 
			this.splat();
		} else if (this.state.nextCharacter === ')') {
			this.createNewTransition('new');
			this.updateTransitionsIndex();
			this.updateRegexIndex(1)
			this.grouping();
		}
		
	}

	splat() {
		this.createNewTransition('feedback'); // add a transition to the current state on the current character
		this.updateRegexIndex(2); // increase the regex index by 2
		this.getCharactersInRegex(); // get the new characters in the regex
	}

	carrot() {
		
	}

	alternator() {

	}

	period() {

	}

	eof() {

	}


	// gets called when the input changes
	onInputChange(event) {
		this.setState({regex: event.target.value});
	}

	// gets called when the form is submitted
	onFormSubmit(event) {
		event.preventDefault(); // so the browser doesn't submit the form
		if(this.validate() === false) {
			this.setState({error: ''});
			this.getCharactersInRegex(); // get the characters in the regex
			this.updateRegexIndex(1); // update the regex
			this.convertToNFA(); // call the recursive function
		} else {
			this.setState({error: 'Enter a regular expression'});
		}
		// this.setState({regex: ''});
	}

	render() {
		return(
			<div>
				<form className="input-group" id="input-group" onSubmit={this.onFormSubmit}>
					<label htmlFor="input-group" id="input-label">{this.state.error}</label>
					<input
						id="input"
						className="form-control"
						onChange={this.onInputChange}
						placeholder="Input a Regular Expression"
						value={this.state.regex}
					/>	
					<span className="input-group-btn">
						<button className="btn btn-secondary">Submit</button>
					</span>
				</form>
			</div>
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

export default connect(mapStateToProps)(Regex);

