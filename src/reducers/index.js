import { combineReducers } from 'redux';
import InputBoxReducer from './reducer_input_box';
import OutputBoxReducer from './reducer_output_box';
import AutomataReducer from './reducer_output_Automata';
import AcceptedStateReducer from './reducer_accepted_state';

const rootReducer = combineReducers({
	input: InputBoxReducer,
	acceptedLines : OutputBoxReducer,
	automata: AutomataReducer,
	acceptedState: AcceptedStateReducer
});

export default rootReducer;
