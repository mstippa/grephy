# Grephy

# Getting Started
1. Clone the repository
2. Run npm install to download dependencies
3. Run npm start to start up a local server in the browser on port 8080

# Usage
Grephy is a version of the grep utility. It searches text files for regular expression pattern matches and produces graphs for the NFA and DFA. If the regular expression pattern is found as a substring in a line of the file, the line will be printed to the output section and computation will continue on the next line in the file. New lines are separated by spaces in the output section DFA computation is used to test each line of the file. The regular expression conversion and the DFA computation can be found in regex.js. Unfortunately, the page has to be refreshed in order to test the regex again because if I reset the components state, the component re-renders anyway.

# Regular Expression Characters
`*` - zero or more<br/>
| - or<br/>
() - grouping<br/>
. - matches any character<br/>

# Graphs
The NFA and DFA get displayed as graphs. You can zoom in and out of the graphs as well as drag and drop the nodes and edges. The accepting state and error state are labeled with @ and error.

Using Stephen Grider's Boilerplate package: https://github.com/StephenGrider/ReduxSimpleStarter


