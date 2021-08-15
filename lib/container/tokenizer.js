function getLabellingBeforeTokenize(tagName, refName) {

    function beforeTokenize(state, params) {
        const env = state.env
        const counter = env.counter
        // Create counter if hasn't
        if (!counter[tagName])
            counter[tagName] = [0]
        // Update counter
        if (!params.no_index) {
            counter[tagName][0]++
        }
        // Assign default id
        if (!params.id) {
            params.id = toLowerLine(tagName) + "-" + counter[tagName].join('-')
        }
        // Register idNames
        env.idNames[params.id] = {
            tagName: tagName,
            refName: refName || tagName,
            index: counter[tagName].slice() // assign a copy of the index array
        }
    }

    return beforeTokenize

}
module.exports.getLabellingBeforeTokenize = getLabellingBeforeTokenize

function toLowerLine(str) {
	var temp = str.replace(/[A-Z]/g, function (match) {	
		return "_" + match.toLowerCase();
  	});
  	if(temp.slice(0,1) === '_'){
  		temp = temp.slice(1);
  	}
	return temp;
};