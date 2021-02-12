
class NormalizeText {

    parseText(text) {

        var chars = {
            "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
            "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",
            "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
            "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N"
        }
        var expr = /[áàéèíìóòúùñ]/ig;
        var res = text.replace(expr, function (e) { return chars[e] });
        return res.split(' ').join('').toLowerCase();


    }

    sin_espacios(text = "") {

        return text !== "" && text !== null ? text.trim().replace(/ /g, "") : text
    }
}

export default new NormalizeText()