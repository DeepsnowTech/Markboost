const { writeElement, writeOpen, writeEnd, writeWarning, writeInline } = require("../../renderer")
const { getLabeller } = require("../../tokenizer")
const { escapeHtml } = require("./tokenizer")


function render(tokens, idx, _options, env, slf) {
    if (!env.author) {
        return writeWarning("No author specified!")
    }
    if (!env.affils) {
        env.affils = {}
    }
    if (!env.authorNotes) {
        env.authorNotes = {}
    }
    if (typeof env.author == String) {
        env.author = [{ givenName: env.author }]
    }
    if (!Array.isArray(env.author)) env.author = [env.author]

    let affilIndices = preProcessNoteDict(env.author, env.affils, "affil", true)
    let noteIndices = preProcessNoteDict(env.author, env.authorNotes, "note", false)

    return getAuthorBox(env.author, env.affils, affilIndices, env.authorNotes, noteIndices)
}

const noteSupChar = ["*", "⁑", "†", "‡", "⁂", "⁝", "⁖", "⁘", "※"]
const noteSupCharLen = noteSupChar.length

function getAuthorBox(author, affilDict, affilIndices, noteDict, noteIndices) {
    let res = []
    res.push(writeOpen("div", { class: "author-box" }))
    res.push(writeOpen("div", { class: "author-list" }))
    for (let info of author) {
        res.push(writeOpen("span", { class: "author-entry" }))
        res.push([info.givenName, info.familyName].join(" "))
        res.push(writeOpen("sup", null))
        // Process affiliation
        if (info.affil) {
            for (let affil of info.affil) {
                let attr = { class: "author-sup-link", href: "#affil-def-" + affil }
                res.push(writeElement("a", attr, affilIndices[affil]))
            }
        }
        // Process footnote
        if (info.note) {
            for (let note of info.note) {
                let attr = { class: "author-sup-link", href: "#note-def-" + note }
                let label = noteSupChar[(noteIndices[note] - 1) % noteSupCharLen]
                res.push(writeElement("a", attr, label))
            }
        }
        res.push(writeEnd("sup"))
        res.push(writeEnd("span"))
    }
    res.push(writeEnd("div")) // End author-list
    res.push(writeOpen("div", { class: "affil-list" }))
    for (let affilKey in affilIndices) {
        res.push(writeElement("p", { class: "author-note-define", id: "affil-def-" + affilKey }, writeInline("sup", null, affilIndices[affilKey]) + affilDict[affilKey]))
    }
    for (let noteKey in noteIndices) {
        let label = noteSupChar[(noteIndices[noteKey] - 1) % noteSupCharLen]
        res.push(writeElement("p", { class: "author-note-define", id: "note-def-" + noteKey }, writeInline("sup", null, label) + noteDict[noteKey]))
    }
    res.push(writeEnd("div")) // End affil-list
    res.push(writeEnd("div")) // End author-box
    return res.join("")
}

function preProcessNoteDict(objects, noteDict, attrName, mergeSame) {
    let usedNote = []
    let noteIndices = {}
    for (let obj of objects) {
        let notes = obj[attrName]
        if (!notes) continue;
        if (!Array.isArray(notes)) {
            obj[attrName] = [notes]
            notes = obj[attrName]
        }
        for (let i in notes) {
            let note = notes[i]
            // If this note is not registered
            if (!noteDict[note]) {
                // Find whether a value in the noteDict match the affil string
                let existingKey = null
                if (mergeSame) {
                    existingKey = getKeyByValue(noteDict, note)
                    if (existingKey) {
                        notes[i] = existingKey
                        note = existingKey
                    }
                }
                if ((!existingKey) || (!mergeSame)) {
                    let newKey = "not-registered-" + Object.keys(noteDict).length
                    noteDict[newKey] = note
                    notes[i] = newKey
                    note = newKey
                }
            }
            let index = usedNote.indexOf(note)
            if (index < 0) {
                usedNote.push(note)
                noteIndices[note] = usedNote.length
            }
        }
    }
    return noteIndices
}



function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function preProcessAuthorAffil(authors, affilDict) {
    let usedAffil = []
    let affilIndices = {}
    for (let info of authors) {
        if (!info.affil) continue;
        if (!Array.isArray(info.affil)) info.affil = [info.affil]
        for (let i in info.affil) {
            let affil = info.affil[i]
            // If this affil is not registered
            if (!affilDict[affil]) {
                // Find whether a value in the affilDict match the affil string
                let existingKey = getKeyByValue(affilDict, affil)
                if (existingKey) {
                    info.affil[i] = existingKey
                    affil = existingKey
                } else {
                    let newKey = "not-registered-" + Object.keys(affilDict).length
                    affilDict[newKey] = affil
                    info.affil[i] = newKey
                    affil = newKey
                }
            }
            let index = usedAffil.indexOf(affil)
            if (index < 0) {
                usedAffil.push(affil)
                affilIndices[affil] = usedAffil.length
            }
        }
    }
    return affilIndices
}

module.exports = {
    attrs: {
        innerType: 0
    },
    beforeTokenize: null,
    render: render
}