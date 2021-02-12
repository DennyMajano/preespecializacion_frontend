
class UtilsDocuments {

    dui(str) {
        const regex = /(^\d{9}$)/;
        const dui = str.match(regex);
        if (dui !== null) {
            const digitos = dui[0].substring(0, 8).split('').map((x) => parseInt(x));
            const verificador = parseInt(dui[0].substring(8, 9));
            const suma = digitos.reduce((sum, value, i) => sum + (9 - i) * value);
            return verificador === (10 - (suma % 10)) % 10;
        } else {
            return false;
        }
    };


    nit(str) {
        const regex = /(^\d{14}$)/;
        const nit = str.match(regex);
        if (nit !== null) {
            const verificador = nit[0].substring(13, 14);
            const nitAr = nit[0].split('').map((x) => parseInt(x));
            if (nit[0].substring(10, 13) <= 100) {
                var verifier = str[str.length - 1]
                var digits = str.slice(0, -1)
                var sum = 0;
                for (var i = 0; i < digits.length; i++) {
                    sum += Number(digits[i]) * (digits.length + 1 - i);
                }
                sum %= 11;
                return sum === parseInt(verifier);

            } else {
                let suma = 0;
                for (let i = 1; i <= 13; i++) {
                    let factor = (3 + 6 * Math.floor(Math.abs((i + 4) / 6))) - i
                    suma += nitAr[i - 1] * factor
                }
                const residuo = suma % 11;
                const validacion = residuo > 1 ? 11 - residuo : 0;
                return validacion === parseInt(verificador)
            }
        }
        return false;
    }
    is_url(str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str.toLowerCase())) {
            return true;
        }
        else {
            return false;
        }
    }
}

export default new UtilsDocuments()