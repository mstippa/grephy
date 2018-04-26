import { combineReducers } from 'redux';
import InputBoxReducer from './reducer_input_box';
import OutputBoxReducer from './reducer_output_box';

const rootReducer = combineReducers({
	input: InputBoxReducer,
	regexData: OutputBoxReducer
});

export default rootReducer;
