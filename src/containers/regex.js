import React, { Component } from 'react';

// an array that represents the transition functions from state to state
// the index into the array represents a state
var transitions = [];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';

export default class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '',
			error: '',
			indexInRegex: 0, // the current index in the regex
			transitionState: 0, // the state where 
			indexInTransitions: 0, // the index into the transitions array, represents state
			curCharacter: '', // the current character in the regex 
			regexChar: {
				'*': this.splat(),
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

	// checks if the the input is empty
	validate() {
		return (this.state.regex === '');
	}

	// recursive function
	convertToNFA() {
		// deciphering the regex
		if (this.state.indexInRegex < this.state.regex.length) {
			// changing the current character in the regex and passing in a callback function
			this.setState({curCharacter: this.state.regex.charAt(this.state.indexInRegex)}, () => {
				// seeing if the current character is a regexChar
				if (this.state.curCharacter in this.state.regexChar) {					
					this.state.regexChar[this.state.curCharacter]; // call the function associated with the regex character
				} else {
					this.character();
				}
				this.setState({indexInRegex: this.state.indexInRegex+1}); // increment the regex index
				this.convertToNFA(); // keep calling the function until the regex is deciphered
			});
			

		// finished deciphering the regex
		} else {
			console.log(transitions);
		}

	}

	character() {
	transitions[this.state.indexInTransitions]= [[]]
		
	}

	carrot() {
		
	}

	alternator() {

	}

	grouping() {

	}

	splat() {

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
			this.props.getFilePath();
			this.convertToNFA();
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

