function getLabeller(tagName, refName) {

    function label(state, params, level, record) {
        const env = state.env
        let tagCounter = env.counter[tagName]
        level = level || 0
        record = record || {}

        // Create counter if hasn't
        if (!tagCounter) {
            tagCounter = new Array(level + 1).fill(0)
            env.counter[tagName] = tagCounter
        } else if (tagCounter[level] === undefined) {
            tagCounter = tagCounter.concat(new Array(level + 1 - tagCounter.length).fill(0))
            env.counter[tagName] = tagCounter
        }

        // Update counter
        if (!params.no_index) {
            tagCounter[level]++
            // Make counter after current level all zero
            for (let i = level + 1; i < tagCounter.length; i++) {
                tagCounter[i] = 0
            }
        } else {
            return
        }

        let index = tagCounter.slice(0, level + 1) // assign a copy of the index

        // Assign default id
        if (!params.id) {
            params.id = toLowerLine(tagName) + "-" + index.join('-')
        }
        // Register idNames
        env.idNames[params.id]
        record = Object.assign(record, {
            tagName: tagName,
            refName: refName || tagName,
            index: index
        })
        env.idNames[params.id] = record
        params["index"] = index.join(".")
    }

    return label

}
module.exports.getLabeller = getLabeller

function toLowerLine(str) {
    var temp = str.replace(/[A-Z]/g, function (match) {
        return "_" + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '_') {
        temp = temp.slice(1);
    }
    return temp;
};