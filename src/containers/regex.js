import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; // this function allows a created action to flow through all of the reducers 
// action creators
import { transitionFunction } from '../actions';
import { carrot } from '../actions';
import { eof } from '../actions';
import { acceptingState } from '../actions';

// an array that represents the transition functions from state to state
// the index into the array represents a state
export var transitions = [];
var regex = '';
var groupingIndex = -1; // the index that keeps track of current state when there is ()*
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.?<>!@#%&+={[]} '; // all the acceptable characters

class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '', // holds the regex string
			error: '', 
			indexInRegex: 0, // the current index in the regex
			indexInTransitions: 0, // the index into the transitions array, represents state			
			curCharacter: '', // the current character in the regex
			nextCharacter: '', // the next character in the regex
			carrot: false, // if the regex contains a carrot
			eof: false // if the regex contains a "$" 
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
			if (transitions[this.state.indexInTransitions]) {
				transitions[this.state.indexInTransitions][curCharacter] = [this.state.indexInTransitions+1] // creating a transition to a new state
			} else {
				stateTransitions[curCharacter] = [this.state.indexInTransitions+1]; // creating a transition to a new state
				transitions[this.state.indexInTransitions] = stateTransitions; // add the state object to the transitions table
			}			 
		} else { // if the transition needs to loopback
			if (transitions[this.state.indexInTransitions]) { // if there is already transitions on the current state
				if (groupingIndex === -1) { // if the transition loops back to the current state
					transitions[this.state.indexInTransitions][curCharacter] = [this.state.indexInTransitions]; // creating a transition to the current state
					// stateTransitions[curCharacter] = [this.state.indexInTransitions] 
				} else {
					transitions[this.state.indexInTransitions][curCharacter] = [groupingIndex] // creating a transition back to a previous state
					// stateTransitions[curCharacter] = [groupingIndex]; 
					groupingIndex = -1;
				}
			} else { // if there are no transitions on the current state
				if (groupingIndex === -1) {
					stateTransitions[curCharacter] = [this.state.indexInTransitions];
				} else {
					stateTransitions[curCharacter] = [groupingIndex];
					groupingIndex = -1;
				}

				transitions[this.state.indexInTransitions] = stateTransitions;
			}				
		}	
	}

	// updates the regex index depending on the increment argument
	updateRegexIndex(increment, callback) {
		this.setState({indexInRegex: this.state.indexInRegex + increment}, () => {
			callback();		
		});
	}

	// updates the transition index
	updateTransitionsIndex(callback) {
		this.setState({indexInTransitions: this.state.indexInTransitions+1}, () => {
			callback();
		});
	}

	// updates this.state.curCharacter and this.state.nextCharacter using this.state.indexInRegex
	getCharactersInRegex(callback) {
		var regexIndex = this.state.indexInRegex;
		if (regexIndex != regex.length) {  // to prevent an "array out of bounds" error				
			this.setState({curCharacter: this.state.regex.charAt(this.state.indexInRegex)}, () => { // changing the current character in the regex and passing in a callback function		
				if (regexIndex+1 !== regex.length) { // if the next character is not null					
					this.setState({nextCharacter: this.state.regex.charAt(this.state.indexInRegex+1)}, () => { // changing the next character in the regex and passing in a callback function
						callback();
					});
				} else { // if the next character is null
					this.setState({nextCharacter: null}, () => {
						callback();
					});
				}	
			});
		} else { 
			callback();
		}		
	}

	// reads the regex and calls the correct production based on the current character 
	convertToNFA() {
		if (this.state.error !== "") { // if there is an error in the regex
			return false;
		} else {
			// console.log(this.state.indexInRegex + "this is the index in the regex");
			if (this.state.indexInRegex > regex.length) { // if no more characters to read
				this.props.carrot(this.state.carrot); // calling the carrot action creator
				this.props.eof(this.state.eof); // calling the eof action creator
				this.props.acceptingState(this.state.indexInTransitions); // calling the acceptingState action creator
				this.props.transitionFunction(transitions); // calling the transitionFunction action creator, passing in the transitions array
			} else { 
				switch (this.state.curCharacter) {
					case '(':
					console.log("current character: " + this.state.curCharacter);
						this.grouping(() => {
							this.convertToNFA();						
						});
						break;
					case ')':	
					console.log("current character: " + this.state.curCharacter);		
						this.grouping(() => {
							this.convertToNFA();
						});
						break;
					case '*':
						this.splat(() => {
							this.convertToNFA();
						});
						break;
					case '|':
						this.alternator(() => {
							this.convertToNFA();
						});
						break;
					case '.':
						this.period(() => {
							this.convertToNFA();
						});
						break;
					case '^':
						this.carrot(() => {
							this.convertToNFA();
						});
						break;
					case '$':
						this.eof(() => {
							this.convertToNFA();
						});
						break;
					default:
						this.character(() => {
							this.convertToNFA();
						});						
				}	
			}
		}	
	}

	// ******** Productions that get called when a specific character in regex is read ********** \\

	grouping(callback) {
		if (this.state.curCharacter === '(') {
			groupingIndex = this.state.indexInTransitions; // need to remember the current state in case we'll need to loopback to it
			console.log("groupingIndex: " + groupingIndex);
			this.getCharactersInRegex(() => { 	// get the new characters in the regex
				this.updateRegexIndex(1, () => { // increase the regex index by 1	
					console.log("calling nfa");	
					callback(); // keep calling the function until the regex is converted into an NFA
				});
			}); 
		} else { // then the next character is ")"	
			if (alphabet.indexOf(this.state.regex.charAt(this.state.indexInRegex+1)) > -1 || this.state.indexInRegex+1 == regex.length) { // need to look two symbols ahead
				this.createNewTransition('new');
				this.updateRegexIndex(1, () => { // need to update the regex first because we were looking to symbols ahead
					this.getCharactersInRegex(() => {
						this.updateRegexIndex(1, () => {
							callback();
						});
					});
				});
			} else if (this.state.regex.charAt(this.state.regexIndex+1) === '*') {
				this.splat(callback);
			} 

		}
	}

	character(callback) {
		if (alphabet.indexOf(this.state.nextCharacter) > -1 || this.state.nextCharacter === null) { // if the next character in the regex is in the alphabet or null
			console.log("i like pooping so much");
			this.createNewTransition('new'); // add a transition to a new state on the current character
			this.updateTransitionsIndex(() => { // update the transitions index
				this.getCharactersInRegex(() => { 	// get the new characters in the regex
					this.updateRegexIndex(1, () => { // increase the regex index by 1		
						callback() // keep calling the function until the regex is converted into an NFA
					});
				}); 
			}); 			 				
		} else if (this.state.nextCharacter === '*') { // if the next character in the regex is the splat symbol 
			this.splat(callback);
		} else if (this.state.nextCharacter === '(') {			
			this.createNewTransition('new')
			this.updateTransitionsIndex(() => {
				this.getCharactersInRegex(() => {
					this.updateRegexIndex(1, () => {
						console.log(this.state.curCharacter);
						this.grouping(callback);
					});
				});	
			});
		} else if (this.state.nextCharacter === ")") {
			this.grouping(callback);

		} else if (this.state.nextCharacter === "|") {
			this.alternator(callback);
		}	
	}

	splat(callback) {
		this.createNewTransition('feedback') // add a transition to the current state on the current character
		this.updateRegexIndex(1, () => { // need to update the index first
			this.getCharactersInRegex(() => {
				this.updateRegexIndex(1, () => {
					callback();
				});
			});
		});					
	}

	carrot(callback) {
		if (this.state.regex.charAt(0) === "^") { // if the first character in the regex is the carrot
			this.getCharactersInRegex(() => {
				this.updateRegexIndex(1, () => {
					this.setState({carrot: true}, () => {
						callback();
					});						
				});
			});
		} else { // if the first character in the regex is not the carrot return an error
			this.setState({error: 'Invalid Regex'}, () => {
				callback();
			})
		}
		
	}

	alternator(callback) {
		if (this.state.curCharacter === "|") { // if the current character is "|"
			this.getCharactersInRegex(() => {
				this.updateRegexIndex(1,() => {
					callback();
				});
			});
		} else { // if the next character is "|"
			this.createNewTransition("new");
			this.updateRegexIndex(1, () => { // need to update the regex index first
				this.getCharactersInRegex(() => {
					this.updateRegexIndex(1, () => {
						callback();
					});
				});
			});
		}				
	}

	period(callback) {
		this.createNewTransition("new");
		this.getCharactersInRegex(() => {
			this.updateRegexIndex(1, () => {
				callback();
			});
		});
	}

	eof(callback) {
		var lastIndex = regex.length -1;
		if (this.state.regex.charAt(lastIndex) !== "$") {
			this.setState({error: 'Invalid Regex'}, () => {
				callback;
			});
		} else {
			this.setState({eof: true}, () => {
				callback();
			});
		}
	}

	// ********************************************************8 //

	// gets called when the input changes
	onInputChange(event) {
		this.setState({regex: event.target.value});
	}

	// gets called when the form is submitted
	onFormSubmit(event) {
		event.preventDefault(); // so the browser doesn't submit the form
		if (this.props.inputText !== "") {
			regex = this.state.regex; // assign the regex to a global variable
			if(this.validate() === false) {			
				this.setState({error: ''}, () => {
					this.getCharactersInRegex(() => {
						this.updateRegexIndex(1, () => {
							this.convertToNFA();							
						});					
					});			
				});
			} else {
				this.setState({error: 'Enter a regular expression'});
			}
		} else {
			this.setState({error: 'Upload a file'});
		}
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
				<br></br>
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

// this maps the action creators to this container
function mapDispatchToState(dispatch) {
	return bindActionCreators({ // 
		carrot: carrot,
		eof: eof,
		acceptingState: acceptingState,
		transitionFunction: transitionFunction
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToState)(Regex);

