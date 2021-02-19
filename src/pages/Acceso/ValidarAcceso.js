import React, { Component } from "react";

export default class ValidarAcceso extends Component {
  render() {
    return (
      <React.Fragment>
        <section id="wrapper">
          <div
            className="login-register"
            style={{
              backgroundImage:
                "url(../assets/images/background/login-register.jpg)",
            }}
          >
            <div className="login-box card">
              <div className="card-body">
                <form
                  className="form-horizontal"
                  id="loginform"
                  action="index.html"
                >
                  <h3 className="box-title m-b-20">Verificacíon de acceso</h3>
                  <div className="form-group ">
                    <div className="col-xs-12">
                      <label htmlFor="">Código de seguridad:</label>
                      <input
                        className="form-control"
                        type="text"
                        required
                        placeholder="Ingrese código seguridad"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-xs-12">
                      <label htmlFor="">Nueva Contraseña:</label>

                      <input
                        className="form-control"
                        type="text"
                        required
                        placeholder="Ingrese nueva contraseña"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-xs-12">
                      <label htmlFor="">Confirmar Contraseña:</label>

                      <input
                        className="form-control"
                        type="text"
                        required
                        placeholder="Repita nueva contraseña"
                      />
                    </div>
                  </div>
                  <div className="form-group text-center m-t-20">
                    <div className="col-xs-12">
                      <button
                        className="btn btn-inverse btn-lg btn-block text-uppercase waves-effect waves-light"
                        type="submit"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
