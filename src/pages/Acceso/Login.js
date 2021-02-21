import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Encryption from "../../services/Encrypt";
import Request from "../../services/Request";
export default class Login extends Component {
  hrefLink = null;
  constructor(props, context) {
    super(props, context);
    this.state = this.inicial_state;
  }
  myhref = null;
  inicial_state = {
    username: "arielopez229422@gmail.com",
    password: "12345",
    logueando: false,
    error_credenciales: false,
    error_login: false,
  };
  handleInputChange = (e) => {
    const idComponente = e.target.id;
    const valorComponente = e.target.value;
    this.setState({ [idComponente]: valorComponente });
  };

  async componentDidMount() {
    const side = document.createElement("script");
    side.src = `${process.env.PUBLIC_URL}/assets/js/sidebarmenu.js`;
    side.async = true;
    const custom = document.createElement("script");
    custom.src = `${process.env.PUBLIC_URL}/assets/js/custom.min.js`;
    custom.async = true;
    document.body.appendChild(custom);
    document.body.appendChild(side);
  }
  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      error_credenciales: false,
    });
    if (this.state.username !== "" && this.state.password !== "") {
      const data = {
        correo_electronico: this.state.username,
        password: this.state.password,
      };
      if (this.state.logueando === false) {
        this.setState({
          logueando: true,
        });
        Request.POST_A("login", data).then((result) => {
          this.setState({
            logueando: false,
          });
          if (result !== false) {
            switch (result.status) {
              case 200:
                let datos = result.data;

                Encryption.setSession("alias", datos.acceso.alias);
                Encryption.setSession("correo", datos.acceso.correo);

                Encryption.setSession("usuario", datos.acceso.usuario);

                Encryption.setSession(
                  "modulos",
                  JSON.stringify(datos.acceso.modulos)
                );

                Encryption.setSession("token", datos.acceso.token);
                this.props.history.push("/");
                break;

              case 401:
                this.setState({
                  error_credenciales: true,
                });

                setTimeout(() => {
                  this.setState({
                    error_credenciales: false,
                  });
                }, 4000);

                break;

              default:
                break;
            }
          } else {
            this.setState({
              error_login: true,
            });
            setTimeout(() => {
              this.setState({
                error_login: false,
              });
            }, 4000);
          }
        });
      }
    } else {
      alert("ingrese sus credenciales");
    }
  };
  render() {
    if (Encryption.getSession("token")) {
      return <Redirect to={"/"} />;
    }
    return (
      <React.Fragment>
        <section
          id="wrapper"
          className="login-register login-sidebar"
          style={{
            backgroundImage:
              "url(../assets/images/background/login-register.jpg)",
          }}
        >
          <div className="login-box card">
            <div className="card-body">
              <form
                className="form-horizontal form-material text-center"
                id="loginform"
                onSubmit={this.onSubmit}
              >
                <a href={this.myhref}>
                  <img src="../assets/images/logo-icon.png" alt="Home" />
                  <br />
                  <img src="../assets/images/logo-text.png" alt="Home" />
                </a>
                <div className="col-12">
                  {this.state.error_credenciales === true && (
                    <div
                      className="alert alert-danger text-center m-4"
                      role="alert"
                    >
                      <i className="ti-alert mr-2"></i>
                      ¡Usuario o contraseña no son correctos o no tienes
                      autorización!
                    </div>
                  )}

                  {this.state.error_login === true && (
                    <div
                      className="alert alert-danger text-center m-4"
                      role="alert"
                    >
                      <i className="ti-alert mr-2"></i>
                      ¡No se ha podido iniciar sesión por un error en el
                      servidor, comuniquese con el administrador!
                    </div>
                  )}
                </div>
                <div className="form-group m-t-40">
                  <div className="col-xs-12">
                    <input
                      id="username"
                      className="form-control"
                      type="text"
                      value={this.state.username}
                      onChange={this.handleInputChange}
                      placeholder="Correo eléctronico"
                    />{" "}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-xs-12">
                    <input
                      id="password"
                      className="form-control"
                      type="password"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      placeholder="Contraseña"
                    />{" "}
                  </div>
                </div>

                <div className="form-group text-center m-t-20">
                  <div className="col-xs-12">
                    <button
                      className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
                      type="submit"
                      disabled={this.state.logueando}
                    >
                      {this.state.logueando === false
                        ? "Iniciar sesión"
                        : "Iniciando..."}
                    </button>
                  </div>
                </div>

                <div className="form-group m-b-0 text-center">
                  <div className="col-sm-12 text-center">
                    <p>
                      ¿Olvidaste tu contraseña?{" "}
                        <Link to="/restaurar_acceso">Restaurar</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
