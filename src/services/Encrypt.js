import CryptoJS from 'crypto-js'
import SecureStorage from 'secure-web-storage'
//Clase para encriptar 
class Encrypt {
    // se crea la instancia de la clase SecureStore y se pasa el argumento de la sessionStore que es lo que queremos encriptar
    secure = new SecureStorage(sessionStorage,
        {// se configura el tipo de hash a utilizar y se coloca la llave de encriptacion
            hash: function hash(key) {
                key = CryptoJS.SHA256(key, process.env.REACT_APP_KEY);

                return key.toString();
            },
            //Funcion para encriptar la session
            encrypt: function encrypt(data) {
                data = CryptoJS.AES.encrypt(data, process.env.REACT_APP_KEY);

                data = data.toString();

                return data;
            },
            //funcion para desencriptar la sesion
            decrypt: function decrypt(data) {
                data = CryptoJS.AES.decrypt(data, process.env.REACT_APP_KEY);

                data = data.toString(CryptoJS.enc.Utf8);

                return data;
            }
        }
    )
    //funcion para encriptar texto
    encrypt(text) {
        const encrypt_text = CryptoJS.AES.encrypt(text, process.env.REACT_APP_KEY)
        return encrypt_text
    } //!NO SE USA POR AHORA
    //funcion para desecriptar texto
    decrypt(text) {
        const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_APP_KEY)
        const decrypt_text = bytes.toString(CryptoJS.enc.Utf8)
        return decrypt_text
    } //!NO SE USA POR AHORA

    //funcion para crear variables de session encriptadas
    setSession(key, value) {
        this.secure.setItem(key, value)
    }

    //funcion para obtener la variable de session que fue encripta pero ya en texto plano
    getSession(key) {
        return this.secure.getItem(key)
    }

    //Funcion para destruir variable de sesion especifica
    destroyItemSession(key) {
        this.secure.removeItem(key);
    }

    //Funcion para borrar todas las variables de seccion
    clearSession() {
        this.secure.clear()
    }

}

export default new Encrypt();