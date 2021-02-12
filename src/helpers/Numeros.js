class Numeros {
  miles_separador(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  isdecimal(num) {
    return num % 1 !== 0 ? true : false;
  }
}
export default new Numeros();
