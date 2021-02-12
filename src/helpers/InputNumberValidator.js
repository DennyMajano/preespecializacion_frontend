class InputNumberValidator {

    validation() {
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type.toLowerCase() === 'number') {
                inputs[i].addEventListener("mousewheel",
                    function (event) {
                        this.blur()
                    });
            }
        }

    }
}
export default new InputNumberValidator()