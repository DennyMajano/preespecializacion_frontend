import React, { Component } from "react";
import Encryptacion from "../../services/Encrypt";
import { NavLink } from "react-router-dom";
import Request from "../../services/Request";
import DefaultImage from "../utils/images/default.png";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = this.inicial_state;
    this.state.imagen = DefaultImage;
  }

  hrefLink = null;

  inicial_state = {
    imagen: null,
    modulos: JSON.parse(Encryptacion.getSession("modulos")),
    logout: false,
  };

  getImagen() {
    Request.GET_IMAGE(
      "usuarios/profile",
      Encryptacion.getSession("usuario")
    ).then((result) => {
      if (result !== false) {
        // console.log(result.headers["content-type"]);
        if (result.status === 200) {
          let blob = new Blob([result.data], {
              type: result.headers["content-type"],
            }),
            url = window.URL.createObjectURL(blob);

          this.setState({ imagen: url });
        }
      }
    });
  }
  componentDidMount() {
    const side = document.createElement("script");
    side.src = `${process.env.PUBLIC_URL}/assets/js/sidebarmenu.js`;
    side.async = true;
    const custom = document.createElement("script");
    custom.src = `${process.env.PUBLIC_URL}/assets/js/custom.min.js`;
    custom.async = true;
    document.body.appendChild(custom);
    document.body.appendChild(side);
  }

  UNSAFE_componentWillMount() {
    this.getImagen();
  }
  async logout() {
    await Encryptacion.clearSession();

    window.location.href = "/login";
  }
  render() {
    return (
      <React.Fragment>
        <header className="topbar">
          <nav className="navbar top-navbar navbar-expand-md navbar-light">
            {/* ============================================================== */}
            {/* Logo */}
            {/* ============================================================== */}
            <div className="navbar-header">
              <a className="navbar-brand" href="index.html">
                {/* Logo icon */}
                <b>
                  {/*You can put here icon as well // <i class="wi wi-sunset"></i> //*/}
                  {/* Dark Logo icon */}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo-icon.png`}
                    alt="homepage"
                    className="dark-logo"
                  />
                  {/* Light Logo icon */}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo-light-icon.png`}
                    alt="homepage"
                    className="light-logo"
                  />
                </b>
                {/*End Logo icon */}
                {/* Logo text */}
                <span>
                  {/* dark Logo text */}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo-text.png`}
                    alt="homepage"
                    className="dark-logo"
                  />
                  {/* Light Logo text */}
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo-light-text.png`}
                    className="light-logo"
                    alt="homepage"
                  />
                </span>{" "}
              </a>
            </div>
            {/* ============================================================== */}
            {/* End Logo */}
            {/* ============================================================== */}
            <div className="navbar-collapse">
              {/* ============================================================== */}
              {/* toggle and nav items */}
              {/* ============================================================== */}
              <ul className="navbar-nav mr-auto mt-md-0">
                {/* This is  */}
                <li className="nav-item">
                  {" "}
                  <a
                    className="nav-link nav-toggler hidden-md-up text-muted waves-effect waves-dark"
                    href={this.hrefLink}
                  >
                    <i className="mdi mdi-menu" />
                  </a>{" "}
                </li>
                <li className="nav-item m-l-10">
                  {" "}
                  <a
                    className="nav-link sidebartoggler hidden-sm-down text-muted waves-effect waves-dark"
                    href={this.hrefLink}
                  >
                    <i className="ti-menu" />
                  </a>{" "}
                </li>

                {/* ============================================================== */}
                {/* ============================================================== */}
                {/* Messages */}
                {/* ============================================================== */}

                {/* ============================================================== */}
              </ul>
              {/* ============================================================== */}
              {/* User profile and search */}
              {/* ============================================================== */}
              <ul className="navbar-nav my-lg-0">
                {/* ============================================================== */}
                {/* Search */}
                {/* ============================================================== */}

                {/* ============================================================== */}
                {/* Language */}
                {/* ============================================================== */}

                {/* ============================================================== */}
                {/* Profile */}
                {/* ============================================================== */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-muted waves-effect waves-dark"
                    href={this.hrefLink}
                    data-toggle="dropdown"
                  >
                    <img
                      src={this.state.imagen}
                      alt="user"
                      className="profile-pic"
                    />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right scale-up">
                    <ul className="dropdown-user">
                      <li>
                        <div className="dw-user-box">
                          <div className="u-img">
                            <img src={this.state.imagen} alt="user" />
                          </div>
                          <div className="u-text">
                            <h4>{Encryptacion.getSession("alias")}</h4>
                            <p className="text-muted">
                              {Encryptacion.getSession("correo")}
                            </p>
                            <a
                              href="pages-profile.html"
                              className="btn btn-rounded btn-danger btn-sm"
                            >
                              View Profile
                            </a>
                          </div>
                        </div>
                      </li>
                      <li role="separator" className="divider" />
                      <li>
                        <a href={this.hrefLink}>
                          <i className="ti-user" /> My Profile
                        </a>
                      </li>
                      <li>
                        <a href={this.hrefLink}>
                          <i className="ti-wallet" /> My Balance
                        </a>
                      </li>
                      <li>
                        <a href={this.hrefLink}>
                          <i className="ti-email" /> Inbox
                        </a>
                      </li>
                      <li role="separator" className="divider" />
                      <li>
                        <a href={this.hrefLink}>
                          <i className="ti-settings" /> Account Setting
                        </a>
                      </li>
                      <li role="separator" className="divider" />
                      <li>
                        <button
                          className="btn btn-link"
                          onClick={this.logout.bind(this)}
                        >
                          <i className="fa fa-power-off" /> Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <aside className="left-sidebar">
          {/* Sidebar scroll*/}
          <div className="scroll-sidebar">
            {/* User profile */}
            <div className="user-profile">
              {/* User profile image */}
              <div className="profile-img">
                {" "}
                <img src={this.state.imagen} alt="user" />
                {/* this is blinking heartbit*/}
                <div className="notify setpos">
                  {" "}
                  <span className="heartbit" /> <span className="point" />{" "}
                </div>
              </div>
              {/* User profile text*/}
              <div className="profile-text">
                <h5>{Encryptacion.getSession("alias")}</h5>
                <a
                  href={this.hrefLink}
                  className="dropdown-toggle u-dropdown"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <i className="mdi mdi-settings" />
                </a>
                <a href="app-email.html" data-toggle="tooltip" title="Email">
                  <i className="mdi mdi-gmail" />
                </a>
                <a href="pages-login.html" data-toggle="tooltip" title="Logout">
                  <i className="mdi mdi-power" />
                </a>
                <div className="dropdown-menu animated flipInY">
                  {/* text*/}
                  <a href={this.hrefLink} className="dropdown-item">
                    <i className="ti-user" /> My Profile
                  </a>
                  {/* text*/}
                  <a href={this.hrefLink} className="dropdown-item">
                    <i className="ti-wallet" /> My Balance
                  </a>
                  {/* text*/}
                  <a href={this.hrefLink} className="dropdown-item">
                    <i className="ti-email" /> Inbox
                  </a>
                  {/* text*/}
                  <div className="dropdown-divider" />
                  {/* text*/}
                  <a href={this.hrefLink} className="dropdown-item">
                    <i className="ti-settings" /> Account Setting
                  </a>
                  {/* text*/}
                  <div className="dropdown-divider" />
                  {/* text*/}
                  <a href="login.html" className="dropdown-item">
                    <i className="fa fa-power-off" /> Logout
                  </a>
                  {/* text*/}
                </div>
              </div>
            </div>
            {/* End User profile text*/}
            {/* Sidebar navigation*/}
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="nav-devider" />
                <li className="nav-small-cap">Menú General</li>
                <li
                  className={
                    this.props.location.pathname === "/" ? "active" : ""
                  }
                >
                  {" "}
                  <NavLink exact to="/">
                    <i className="mdi mdi-gauge" />
                    <span className="hide-menu">Inicio </span>
                  </NavLink>
                </li>{" "}
                {/*---INFORMES MENSUALES*/}
                <li>
                  {this.state.modulos.includes(
                    "c60cf119-9e48-4267-9b68-1ac6e511bb39"
                  ) && (
                    <a
                      className="has-arrow waves-effect waves-dark"
                      href={this.hrefLink}
                      aria-expanded="false"
                    >
                      <i className="mdi mdi-clipboard-text " />
                      <span className="hide-menu">Informes Mensuales</span>
                    </a>
                  )}
                  <ul className="collapse">
                    {this.state.modulos.includes(
                      "069c8570-a351-4e5b-9228-448893c18e49"
                    ) && (
                      <li>
                        <NavLink to="/informes_mensuales/gestiones_entrega">
                          <i className="mdi mdi-clipboard-flow mr-1" />
                          <span>Gestiones de Entrega</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "8130362d-d425-4019-b47b-42450ee15fed"
                    ) && (
                      <li>
                        <NavLink to="/informes_mensuales/recepcion_informes">
                          <i className="mdi mdi-clipboard-check mr-1" />
                          <span>Recepción de Informes</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
                {this.state.modulos.includes(
                  "32c9c5a4-6b90-4c08-bed4-57caa03ff573"
                ) && (
                  <li
                    className={
                      this.props.location.pathname ===
                        "/presentacion_informes" ||
                      this.props.location.pathname ===
                        "/presentacion_informes/new" ||
                      this.props.location.pathname.includes(
                        "/presentacion_informes/update"
                      )
                        ? "active"
                        : ""
                    }
                  >
                    <NavLink exact to="/presentacion_informes">
                      <i className="mdi mdi-clipboard-check" />
                      <span className="hide-menu">Presentar Informes</span>
                    </NavLink>
                  </li>
                )}
                {this.state.modulos.includes(
                  "18130aec-698b-4d2e-8f24-461eff84c4af"
                ) && (
                  <li
                    className={
                      this.props.location.pathname ===
                        "/periodos_ministeriales" ||
                      this.props.location.pathname ===
                        "/periodos_ministeriales/new" ||
                      this.props.location.pathname.includes(
                        "/periodos_ministeriales/update"
                      )
                        ? "active"
                        : ""
                    }
                  >
                    <NavLink exact to="/periodos_ministeriales">
                      <i className="mdi mdi-calendar-clock" />
                      <span className="hide-menu">Periodos Ministeriales</span>
                    </NavLink>
                  </li>
                )}
                <li>
                  {" "}
                  {this.state.modulos.includes(
                    "79f92aab-e480-4037-bfcd-fb85a7405fe7"
                  ) && (
                    <a
                      className="has-arrow waves-effect waves-dark"
                      href={this.hrefLink}
                      aria-expanded="false"
                    >
                      <i className="mdi mdi-account-multiple" />
                      <span className="hide-menu">Recursos Humanos</span>
                    </a>
                  )}
                  <ul className="collapse">
                    {this.state.modulos.includes(
                      "1a087be0-a30e-4d26-af29-1846a20e2d1a"
                    ) && (
                      <li>
                        <NavLink to="/recursos_humanos/niveles_pastorales">
                          <i className="mdi mdi-file-chart mr-1" />
                          <span>Niveles Pastorales</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "68ff3ca6-05c7-450b-9d6f-5e315ef76d6e"
                    ) && (
                      <li>
                        <NavLink to="/recursos_humanos/niveles_academicos">
                          <i className="mdi mdi-file-chart mr-1" />
                          <span>Niveles Académicos Teológicos</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "9c464bd0-6015-4927-a881-9b0005c645ed"
                    ) && (
                      <li>
                        <NavLink to="/recursos_humanos/personas">
                          <i className="mdi mdi-account-card-details mr-1" />
                          <span>Personas</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "753278e6-c194-4858-ab8e-5d3760cf5ea4"
                    ) && (
                      <li>
                        <NavLink to="/recursos_humanos/pastores">
                          <i className="mdi mdi-account-card-details mr-1" />
                          <span>Pastores</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
                <li>
                  {" "}
                  {this.state.modulos.includes(
                    "efc079e7-b7ee-4c5c-b904-ea5b604f4433"
                  ) && (
                    <a
                      className="has-arrow waves-effect waves-dark"
                      href={this.hrefLink}
                      aria-expanded="false"
                    >
                      <i className="mdi mdi-book-open" />
                      <span className="hide-menu">Organización</span>
                    </a>
                  )}
                  <ul className="collapse">
                    {this.state.modulos.includes(
                      "c13a1b4d-612a-4f46-ba98-6b0bc5e10e47"
                    ) && (
                      <li>
                        <NavLink to="/organizacion/zonas">
                          <i className="mdi mdi-google-maps mr-1" />
                          <span>Zonas</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "dcc3ec83-1367-4166-94e2-ba46c9c029a1"
                    ) && (
                      <li>
                        <NavLink to="/organizacion/distritos">
                          <i className="mdi mdi-map-marker-radius mr-1" />
                          <span>Distritos</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "ca8b7b5c-652d-46db-a640-6ce29b6e7457"
                    ) && (
                      <li>
                        <NavLink to="/organizacion/iglesias">
                          <i className="mdi mdi-church mr-1" />
                          <span>Iglesias</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "b5dcf605-897d-4521-9464-7176e234fd98"
                    ) && (
                      <li>
                        <NavLink to="/administracion/configuracion">
                          <i className="mdi mdi-settings mr-1" />
                          <span>Configuración</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
                <li>
                  {" "}
                  {this.state.modulos.includes(
                    "d5213ccc-c971-40dc-a813-cc63ccfacf13"
                  ) && (
                    <a
                      className="has-arrow waves-effect waves-dark"
                      href={this.hrefLink}
                      aria-expanded="false"
                    >
                      <i className="mdi mdi-timetable" />
                      <span className="hide-menu">Administración</span>
                    </a>
                  )}
                  <ul className="collapse">
                    {this.state.modulos.includes(
                      "6036af3b-234f-4c74-bdec-53a457f39d0a"
                    ) && (
                      <li>
                        <NavLink to="/administracion/maestro_informes">
                          <i className="mdi mdi-file-document mr-1" />
                          <span>Maestro de Informe</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "f91cdcdd-6623-47d7-ae19-87b75e966ff6"
                    ) && (
                      <li>
                        <NavLink to="/administracion/modulos">
                          <i className="mdi mdi-book-multiple mr-1" />
                          <span>Módulos</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "289fd42f-b5d7-430f-a753-13ec027e4134"
                    ) ? (
                      <li>
                        <NavLink to="/administracion/roles">
                          <i className="fa fa-key mr-1" />
                          <span>Roles</span>
                        </NavLink>
                      </li>
                    ) : null}

                    {this.state.modulos.includes(
                      "0e265555-6b54-4f97-b520-c836c4f7b215"
                    ) && (
                      <li>
                        <NavLink to="/administracion/usuarios">
                          <i className="mdi mdi-account-key mr-1" />
                          <span>Usuarios</span>
                        </NavLink>
                      </li>
                    )}

                    {this.state.modulos.includes(
                      "81ea746c-7539-4ff6-b33b-d8bf62f8af9e"
                    ) && (
                      <li>
                        <NavLink to="/administracion/impuestos_especiales">
                          <i className="mdi mdi-gavel mr-1" />
                          <span>Impuestos Especiales</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "d5cd3659-e9d6-4c6f-afae-3d9d1d9c0032"
                    ) && (
                      <li>
                        <NavLink to="/administracion/tipos_documento">
                          <i className="mdi mdi-account-card-details mr-1" />
                          <span>Tipos de Documentos</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "f4dcf8a2-8824-42f8-b8fe-8a0956f2d300"
                    ) && (
                      <li>
                        <NavLink to="/administracion/unidades_medida">
                          <i className="mdi mdi-scale-balance mr-1" />
                          <span>Unidades de Medida</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "b5dcf605-897d-4521-9464-7176e234fd98"
                    ) && (
                      <li>
                        <NavLink to="/administracion/configuracion">
                          <i className="mdi mdi-settings mr-1" />
                          <span>Configuración</span>
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </li>
              </ul>
            </nav>
            {/* End Sidebar navigation */}
          </div>
          {/* End Sidebar scroll*/}
        </aside>
      </React.Fragment>
    );
  }
}

export default Header;
