import React, { Component } from 'react';
import Regex from '../containers/regex';
import File from '../containers/file';
import InputBox from '../containers/input'

export default class App extends Component {
  render() {
    return (
    	<div className="app">
	  		<div className="title-box">
	    		<h1 className="title">Grephy</h1>
	    	</div>

	    	<Regex />	
	    	<File />
	    	<InputBox />
	    </div>	
    );
  }
}
