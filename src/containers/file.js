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
			this.readFile(this.state.file, () => { // call the fileUpload action creator
				console.log("file uploaded");
			}); 
		});
	}

	readFile(file) {

		//Check File API support
    if (window.File && window.FileList && window.FileReader) {

            // var output = document.getElementById("result");


                //Only plain text
                // if (!file.type.match('plain')) {

                var picReader = new FileReader();

                picReader.addEventListener("load", (event) => {

                    var textFile = event.target;
                    this.props.fileUpload(textFile.result); // calling the fileUpload action creator

                    // var div = document.createElement("div");

                    // div.innerText = textFile.result;

                    // output.insertBefore(div, null);


                });

                //Read the text file
                picReader.readAsText(file);

            	// }

    }
    else {
        console.log("Your browser does not support File API");
    }

	}

	render() {
		return (
			<div>
				<form>
					<div className="form-group">
					    <label htmlFor="input-file">File input</label>
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


