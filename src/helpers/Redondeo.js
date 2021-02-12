class Redondeo {
  redondear(number) {
    return parseFloat(number).toFixed(4);
  }

  redondeoDosdecimales(num) {
    var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
  }

  dosDecimalesInput(valorComponente) {
    return valorComponente.indexOf(".") >= 0
      ? valorComponente.substr(0, valorComponente.indexOf(".")) +
          valorComponente.substr(valorComponente.indexOf("."), 3)
      : valorComponente;
  }
}

export default new Redondeo();
