import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; // this function allows a created action to flow through all of the reducers 
// action creators
import { acceptedLinesAction } from '../actions';
import { submitNFA } from '../actions';

/* Global Variables */

// an array that represents the transition function for the NFA
// the index into the array represents a state
var transitions = [];
// array that holds the transition function for the DFA
var transitionsDFA = [];
var acceptedLines = []; // holds the accepted lines of the input file
var regex = '';
var groupingIndex = []; // array that holds the states where the () started
var alternatorStartIndex = 0;
var alternatorIndex = []; // array that holds the last state before the | 
var state = 0; // used for the accepting state
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?<>!@#%&+={[]}-_ '; // all the acceptable characters


class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '', // holds the regex string
			error: '', 
			indexInRegex: 0, // the current index in the regex
			indexInTransitions: 0, // the index into the transitions array, represents state	
			prevCharacter: '', // the previous character in the regex		
			curCharacter: '', // the current character in the regex
			nextCharacter: '', // the next character in the regex
			carrot: false, // if the regex contains a carrot
			eof: false, // if the regex contains a "$"
			curIndex: 0, // the current index in the input file
			startIndex: 0, //  the starting index in a line in the input file
			acceptedLinesIndex: 0, // the index into the acceptedLines array
			acceptingState: 0, // the accepting state			
		};  
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	// checks if the input is empty
	validate() {
		return (this.state.regex === '');
	}

	// gets called when a transition needs to be created
	// transitionType is used to decide if feedback transition or transition to a new state will be created 
	createTransition(transitionType) {
		if (transitionType == 'new') { // if the transition is to a new state
			this.createNewTransition();	
		} else if (transitionType === 'loopback') { // if the transition needs to loopback
			this.createLoopbackTransition();							
		} 	
	}

	// creates a transition to a new state 
	createNewTransition() {
		var curCharacter = this.state.curCharacter; // assign the current character in the regex to a variable
		var stateTransitions = {}; // create an object that will hold all the transitions on a state		
		if (alternatorIndex.length > 0 && this.state.prevCharacter === "(" && this.state.nextCharacter === ")" && groupingIndex.length > 1) { // (abc)|(a)
			state = alternatorIndex.pop();
			if (transitions[groupingIndex.pop()][curCharacter]) { // if a transition on the current character on the current state already exists				
				transitions[groupingIndex.pop()][curCharacter].push(state);
			} else {
				transitions[groupingIndex.pop()][curCharacter] = [state];
			}			
		} else if (alternatorIndex.length > 0 && this.state.prevCharacter === "(" && groupingIndex.length > 1) { // (abc)|(abc)
			state = this.state.indexInTransitions;
			if (transitions[groupingIndex.pop()][curCharacter]) { // if a transition on the current character on the current state already exists
				transitions[groupingIndex.pop()][curCharacter].push(state);
			} else {		
				transitions[groupingIndex.pop()][curCharacter] = [state];
			}	
		} else if (alternatorIndex.length > 0 && this.state.prevCharacter === "(") { // a|(a...
			state = this.state.indexInTransitions+1;
			transitions[alternatorStartIndex][curCharacter] = [state];
		} else if (alternatorIndex.length > 0) { // a|a...
			state = alternatorIndex.pop();
			transitions[alternatorStartIndex][curCharacter] = [state];
		} else { // there are no transitions on the current state
			state = this.state.indexInTransitions+1;
			stateTransitions[curCharacter] = [state]; // creating a transition to a new state
			transitions[this.state.indexInTransitions] = stateTransitions; // add the state object to the transitions table
		}
		console.log(state);

	}

	createLoopbackTransition() {
		console.log("loopback transitions");
		var curCharacter = this.state.curCharacter; // assign the current character in the regex to a variable
		var stateTransitions = {}; // create an object that will hold all the transitions on a state
		if (transitions[this.state.indexInTransitions]) { // if there are already transitions on the current state
			if (groupingIndex.length > 0) { // if the transition loops back to the current state
				transitions[this.state.indexInTransitions][curCharacter] = [this.state.indexInTransitions];					
			} else {
				if (alternatorIndex.length > 0) { // if we need to go back to the last state before the alternator
					transitions[this.state.indexInTransitions][curCharacter] = [alternatorIndex.pop()];
				} else {
					transitions[this.state.indexInTransitions][curCharacter] = [groupingIndex.pop()] // creating a transition back to a previous state
				}
			}
		} else { // if there are no transitions on the current state
			if (groupingIndex.length > 0 && this.state.nextCharacter !== ")") { // if the transition loops back to the current state
				stateTransitions[curCharacter] = [this.state.indexInTransitions];
			} else {
				if (alternatorIndex.length > 0) {
					console.log("alternator index " + alternatorIndex);
					stateTransitions[curCharacter] = [alternatorIndex.pop()];
				} else {
					stateTransitions[curCharacter] = [groupingIndex.pop()]; // creating a transition back to a previous state
				}
			}
			transitions[this.state.indexInTransitions] = stateTransitions;
		}

		if (this.state.indexInRegex === regex.length) {

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
			this.setState({prevCharacter: this.state.curCharacter}, () => { // changing the previous char to the current character	
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
			});	
		} else { 
			callback();
		}		
	}

	// finds the accepting state
	setAcceptingState(state, callback) {
		this.setState({acceptingState: state}, () => {
			callback();
		});
	}

	convertToDFA(callback) {
		
		// var i = 0; // index in the transitions array
		// var character; // is the key of the object at the index in transitions
		// for (var i = 0; i < transitions.length; i++) {
		// 	for (character in transitions[i]) {
		// 		if (transitions[character].length > 1) { // if there are multiple transitions for a character on a state
		// 			transitions[character].splice(1,1); // remove the transition from the array
		// 		} 
		// 	}
		// }
		callback();
	}

	// reads the regex and calls the correct production based on the current character 
	convertToNFA() {
		if (this.state.error !== "") { // if there is an error in the regex
			return false;
		} else {
			// console.log(this.state.indexInRegex + "this is the index in the regex");
			if (this.state.indexInRegex > regex.length) { // if no more characters to read
				this.setAcceptingState(state, () => {
					this.props.submitNFA(transitions)  // calls the submitNFA action creator
					this.convertToDFA(() => {
						this.testFile();
					});
				});					 
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
					// case '^':
					// 	this.carrot(() => {
					// 		this.convertToNFA();
					// 	});
					// 	break;
					// case '$':
					// 	this.eof(() => {
					// 		this.convertToNFA();
					// 	});
					// 	break;
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
		console.log("grouping");
		if (this.state.curCharacter === '(') {
			groupingIndex.unshift(this.state.indexInTransitions); // need to remember the current state in case we'll need to loopback to it or create a new transition from it
			this.getCharactersInRegex(() => { 	// get the new characters in the regex
				this.updateRegexIndex(1, () => { // increase the regex index by 1	
					callback(); // keep calling the function until the regex is converted into an NFA
				});
			}); 
		} else { // then the next character is ")"	
			if (alphabet.indexOf(this.state.regex.charAt(this.state.indexInRegex+1)) > -1 || this.state.indexInRegex+1 == regex.length) { // need to look two symbols ahead
				if (alternatorIndex.length > 0) { 
					this.createTransition('loopback');
					var curChar = this.state.curCharacter;
						this.updateRegexIndex(1, () => {
							if (regex.length != this.state.indexInRegex) {
								this.getCharactersInRegex(() => {
									var nextChar = this.state.curCharacter;
									this.updateRegexIndex(1, () => {
										var stateTransitions = {};
										state = this.state.indexInTransitions+1;
										stateTransitions[nextChar] = [state];
										console.log("you a bitch " + transitions[this.state.indexInTransitions][curChar])
										transitions[transitions[this.state.indexInTransitions][curChar]] = stateTransitions;
										this.updateTransitionsIndex(() => {
											this.getCharactersInRegex(() => {
												this.updateRegexIndex(1, () => {
													callback();
												});
											});
										});											
									});
								});
							} else {
								callback();
							}	
						});
				} else {
					this.createTransition('new');
					this.updateTransitionsIndex(() => {
						this.updateRegexIndex(1, () => { // need to update the regex first because we were looking to symbols ahead
							this.getCharactersInRegex(() => {
								this.updateRegexIndex(1, () => {
									callback();
								});
							});
						});
					});
				}		
			} else if (this.state.regex.charAt(this.state.indexInRegex+1) === '*') {
				this.splat(callback);
			} else if (this.state.regex.charAt(this.state.indexInRegex+1) === '|') {
				this.alternator(callback);
			}
		}
	}

	character(callback) {
		if (alphabet.indexOf(this.state.nextCharacter) > -1 || this.state.nextCharacter === null) { // if the next character in the regex is in the alphabet or null
			this.createTransition('new'); // add a transition to a new state on the current character
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
			this.createTransition('new')
			this.updateTransitionsIndex(() => {
				this.getCharactersInRegex(() => {
					this.updateRegexIndex(1, () => {
						console.log(this.state.indexInTransitions);
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
		this.createTransition('loopback'); // add a transition to the current state on the current character
		this.updateRegexIndex(1, () => { // need to update the index first
			this.getCharactersInRegex(() => {
				this.updateRegexIndex(1, () => {
					callback();
				});
			});
		});					
	}

	// carrot(callback) {
	// 	if (this.state.regex.charAt(0) === "^") { // if the first character in the regex is the carrot
	// 		this.getCharactersInRegex(() => {
	// 			this.updateRegexIndex(1, () => {
	// 				this.setState({carrot: true}, () => {
	// 					callback();
	// 				});						
	// 			});
	// 		});
	// 	} else { // if the first character in the regex is not the carrot return an error
	// 		this.setState({error: 'Invalid Regex'}, () => {
	// 			callback();
	// 		})
	// 	}
		
	// }

	alternator(callback) {
		if (this.state.curCharacter === "|") { // if the current character is "|" - should never come here but just in case
			this.getCharactersInRegex(() => {
				this.updateRegexIndex(1,() => {
					callback();
				});
			});
		} else if (this.state.nextCharacter === "|") { // if the next character is "|"
			this.createTransition("new"); // add a new transition but don't update state
				alternatorStartIndex = this.state.indexInTransitions;
				this.updateTransitionsIndex(() => {
					this.updateRegexIndex(1, () => { // update the regex first
						this.getCharactersInRegex(() => {
							this.updateRegexIndex(1, () => {
								alternatorIndex.push(this.state.indexInTransitions); // need to keep track of last state before the alternator
								callback();
							});
						});
					});
				});	
		} else { // if the character two spots ahead is "|"			
			this.createTransition("new");
			alternatorStartIndex = this.state.indexInTransitions;
			this.updateTransitionsIndex(() => {
				this.updateRegexIndex(2, () => { // need to update the regex index first because we are looking a symbol ahead
					this.getCharactersInRegex(() => {
						this.updateRegexIndex(1, () => {
							alternatorIndex.push(this.state.indexInTransitions); // need to keep track of state before the alternator
							callback();
						});						
					});
				});
			});	
		}				
	}

	period(callback) {
		this.createTransition("new");
		this.getCharactersInRegex(() => {
			this.updateRegexIndex(1, () => {
				callback();
			});
		});
	}

	// eof(callback) {
	// 	var lastIndex = regex.length -1;
	// 	if (this.state.regex.charAt(lastIndex) !== "$") {
	// 		this.setState({error: 'Invalid Regex'}, () => {
	// 			callback;
	// 		});
	// 	} else {
	// 		this.setState({eof: true}, () => {
	// 			callback();
	// 		});
	// 	}
	// }

	// ******************************************************** //

	//***** DFA COMPUTATION ************* //

	// tests the DFA on all lines of the file
	testFile() {
		console.log(transitions);
		console.log(`test file current char: ${this.props.inputText[this.state.curIndex]}`);
		if (this.state.curIndex >= this.props.inputText.length) { // if we have gotten to the end of the input file
			console.log("what the hell")
			this.props.acceptedLinesAction(acceptedLines); // call the acceptedLines action creator and pass in the acceptedLines array
		} else {
			this.setState({startIndex: this.state.curIndex}, () => {
				this.testLine(0) // test the line starting at state 0
			});			
		}
	}

	// tests a line for acceptance 
	// takes in the current state which is the index in the transitionFunction and this.testFile as the callback function
	testLine(state) {	
		var acceptingState = this.state.acceptingState;
		console.log("testLine");
		console.log(`state ${state}`);
		console.log(`accepting state ${this.state.acceptingState}`);
		console.log(state === acceptingState);	
		if (state === acceptingState) { // if we are in an accepting state
			this.findBreak(this.state.curIndex); // move to the end of the line								
		} else {
			var curChar = this.props.inputText[this.state.curIndex];
			console.log(`curchar in testline ${curChar}`);
			if (curChar === "\n" || this.state.curIndex === this.props.inputText.length || curChar === undefined) { // if we have gotten to the end of a line, which means that no substring matches were found on the line
				this.setState({curIndex: this.state.curIndex+1},  () => {
					this.testFile();
				});
			} else {
				if (transitions[state][curChar]) { // if there is a transition on the current character from the current state
					console.log("there is a transition");
					this.setState({curIndex: this.state.curIndex+1}, () => { // update the current index
						this.testLine(transitions[state][curChar]); // recursively call this.testLine on the new state
					});					
				} else { // if there is no transition 
					console.log("there is not a transition")
					this.setState({curIndex: this.state.curIndex+1}, () => { // update the current index
						this.testLine(0); // go back to the starting state
					}); 
				}
			}
		}	
	}

	// finds the next line break in the file
	findBreak(index) {
		console.log(`findBreak`);
		if (index === this.props.inputText.length) { // if we have gotten to the end of the file
			console.log('end of file');
			acceptedLines[this.state.acceptedLinesIndex] = this.props.inputText.substr(this.state.startIndex, index);
			this.setState({curIndex: index}, () => {
				this.testFile();
			});			
		} else {
			var curChar = this.props.inputText[index];
			console.log(curChar + ' bitch');
			if (curChar === "\n") { // if we have found the end of a line
				console.log(this.state.startIndex);
				console.log(index);
				console.log(this.props.inputText.substring(this.state.startIndex, index));
				acceptedLines[this.state.acceptedLinesIndex] = this.props.inputText.substring(this.state.startIndex, index);
				this.setState({acceptedLinesIndex: this.state.acceptedLinesIndex+1}, () => {
					this.setState({curIndex: index+1}, () => {
						this.testFile();
					});
				});
			} else {
				this.findBreak(index+1);
			}
		}	
	}

	// ******************************************************** //

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
	return bindActionCreators({ 
		acceptedLinesAction: acceptedLinesAction,
		submitNFA: submitNFA
		// carrot: carrot,
		// eof: eof,
		// acceptingState: acceptingState,
		// transitionFunction: transitionFunction
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToState)(Regex);

