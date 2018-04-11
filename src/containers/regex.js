import React, { Component } from 'react';
import { connect } from 'react-redux';

// an array that represents the transition functions from state to state
// the index into the array represents a state
var transitions = [];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';

class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '',
			error: '',
			indexInRegex: 0, // the current index in the regex
			indexInTransitions: 0, // the index into the transitions array, represents state
			curCharacter: '', // the current character in the regex
			nextCharacter: '', // the next character in the regex
			specialCharacters: {
				'^': this.carrot(),
				'|': this.alternator(),
				'(': this.grouping(),
				')': this.grouping(),
				'$': this.eof(),
				'.': this.period() 
			}
		};  
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	// checks if the input is empty
	validate() {
		return (this.state.regex === '');
	}

	// creates a new transition 
	createNewTransition(transitionType) {
		var curCharacter = this.state.curCharacter; // assign the current character in the regex to a variable
		var stateTransitions = {}; // create an object that will hold all the transitions on a state
		if (transitionType == 'new') { // if the transition is to a new state
			stateTransitions.curCharacter = [this.state.indexInTransitions+1]; // creating a transition to a new state
		} else { // if the transition is to the current state
			stateTransitions.curCharacter = [this.state.indexInTransitions] // creating a transition to the current state
		}	
		transitions[this.state.indexInTransitions] = stateTransitions; // add the state object to the transitions table 
	}

	updateRegexIndex() {
		this.setState({indexInRegex: this.state.indexInRegex+1});
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

	// recursive function that reads the regex and builds an NFA
	convertToNFA() {		
		if (this.state.indexInRegex === this.state.regex.length) { // if no more characters to read
			console.log(transitions[0]);
		} else {
			this.getCharactersInRegex();			
			if (this.state.curCharacter in this.state.specialCharacters) { // if the current character is a special character					
				this.state.regexChar[this.state.curCharacter]; // call the function associated with the special character
			} else if (alphabet.indexOf(this.state.curCharacter) > -1) { // if the current character is apart of the alphabet
				this.character();
			}
			this.convertToNFA(); // keep calling the function until the regex is deciphered
		}

	}

	character() {
		if (alphabet.indexOf(this.state.nextCharacter) > -1) { // if the next character in the regex is in the alphabet
			this.createNewTransition('new'); // add a transition to a new state on the current character 
			this.updateTransitionsIndex(); // update the transitions index
			this.updateRegexIndex(); // update the regex index
			this.getCharactersInRegex();	// update the current characters
		} else if (this.state.nextCharacter === '*') { // if the next character in the regex is the splat symbol 
			this.createNewTransition('feedback'); // add a transition to the current state on the current character
		}
		
	}

	carrot() {
		
	}

	alternator() {

	}

	grouping() {

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

