import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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

  async componentDidMount() {}
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
        {/* <section id="wrapper">
          <div
            className="login-register"
            style={{
              backgroundImage:
                "url(../assets/images/background/login-register.jpg)",
              height: "100%",
              width: "100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="login-box card">
              <div className="card-body">
                <form
                  className="form-horizontal form-material"
                  id="loginform"
                  onSubmit={this.onSubmit}
                >
                  <h3 className="box-title m-b-20">INICIO DE SESIÓN</h3>
                  <div className="col-12">
                    {this.state.error_credenciales === true && (
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        <i className="ti-alert mr-2"></i>
                        ¡Usuario o contraseña no son correctos o no tienes
                        autorización!
                      </div>
                    )}

                    {this.state.error_login === true && (
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        <i className="ti-alert mr-2"></i>
                        ¡No se ha podido iniciar sesión por un error en el
                        servidor, comuniquese con el administrador!
                      </div>
                    )}
                  </div>
                  <div className="form-group ">
                    <div className="col-xs-12">
                      <input
                        id="username"
                        className="form-control"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                     
                        placeholder="Usuario o Correo"
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
                  <div className="form-group row text-center">
                    <div className="col-md-12 font-14">
                      <div className="checkbox checkbox-primary pull-left p-t-0"></div>{" "}
                      <a
                        href={this.hrefLink}
                        id="to-recover"
                        className="btn btn-link"
                      >
                      ¿Olvidaste
                        tu contraseña?
                      </a>{" "}
                    </div>
                  </div>
                </form>
                <form
                  className="form-horizontal"
                  id="recoverform"
                  action="index.html"
                >
                  <div className="form-group ">
                    <div className="col-xs-12">
                      <h3>Recover Password</h3>
                      <p className="text-muted">
                        Enter your Email and instructions will be sent to you!{" "}
                      </p>
                    </div>
                  </div>
                  <div className="form-group ">
                    <div className="col-xs-12">
                      <input
                        className="form-control"
                        type="text"
                        required
                        placeholder="Email"
                      />{" "}
                    </div>
                  </div>
                  <div className="form-group text-center m-t-20">
                    <div className="col-xs-12">
                      <button
                        className="btn btn-primary btn-lg btn-block text-uppercase waves-effect waves-light"
                        type="submit"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section> */}

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
                      <a
                        href="pages-register2.html"
                        className="text-primary m-l-5"
                      >
                        <b>Restablecer</b>
                      </a>
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
