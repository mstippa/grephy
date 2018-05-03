import { combineReducers } from 'redux';
import InputBoxReducer from './reducer_input_box';
import OutputBoxReducer from './reducer_output_box';
import AutomataReducer from './reducer_output_Automata';

const rootReducer = combineReducers({
	input: InputBoxReducer,
	acceptedLines : OutputBoxReducer,
	automata: AutomataReducer
});

export default rootReducer;
