// this component is the file upload form
// it sends the file to the fileUpload action creator

import React, { Component } from 'react';
import { fileUpload } from '../actions';
import { connect } from 'react-redux';

class File extends Component {
	constructor(props) {
		super(props);

		this.state = {
			file: null
		};

		this.onInputChange = this.onInputChange.bind(this);
		this.readFile = this.readFile.bind(this);
	}

	// gets called when the user chooses a file
	onInputChange(event) {			
		this.setState({file: event.target.files[0]}, () => {
			this.readFile(this.state.file)
		});
	}

	// takes in the input file from the user, reads it and calls an action creator
	readFile(file) {

		//Check File API support
	    if (window.File && window.FileList && window.FileReader) {

            //Only plain text
            // if (!file.type.match('plain')) {

            var fileReader = new FileReader();

            fileReader.addEventListener("load", (event) => {
                var textFile = event.target;
                this.props.fileUpload(textFile.result); // calling the fileUpload action creator, passing in plain text

            });

            //Read the text file
            fileReader.readAsText(file);

    	} else {
        	console.log("Your browser does not support File API");
    	}
	}

	render() {
		return (
			<div>
				<form>
					<div className="form-group">
					    <label htmlFor="input-file">File input (txt files only!)</label>
					    <input 
					    	type="file" 
					    	className="form-control-file" 
					    	id="input-file" 
					    	aria-describedby="fileHelp" 
					    	onChange={this.onInputChange} />
					</div>
				</form>	
			</div>
		);
	}
}

export default connect(null, {fileUpload})(File);


