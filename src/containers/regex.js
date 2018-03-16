import React, { Component } from 'react';

export default class Regex extends Component {
	constructor(props) {
		super(props);

		// this component's state
		this.state = { 
			regex: '',
			error: ''
		};

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);

	}

	// checks if the the input is empty
	validate() {
		return (this.state.regex === '');
	}

	learnAlphabet() {

	}


	// gets called when the input changes
	onInputChange() {
		this.setState({regex: event.target.value});
	}


	// gets called when the form is submitted
	onFormSubmit(event) {
		event.preventDefault();

		if(!this.validate()) {
			this.setState({error: ''});
			this.learnAlphabet();
		} else {
			this.setState({error: 'Enter a regular expression'});
		}
		this.setState({regex: ''});

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