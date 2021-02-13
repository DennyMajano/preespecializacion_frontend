import React, { Component } from "react";
import Encryptacion from "../../services/Encrypt";
import { NavLink } from "react-router-dom";
import Request from "../../services/Request";
import DefaultImage from "../utils/images/default.png";
import RoutesPath from "./../../config/RoutesPath";
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
                </li>
                <li
                  className={
                    this.props.location.pathname === "/categorias" ||
                    this.props.location.pathname === "/categorias/new" ||
                    this.props.location.pathname.includes("/categorias/update")
                      ? "active"
                      : ""
                  }
                >
                  {" "}
                  {this.state.modulos.includes(
                    "dbe5c0ee-253f-40b0-a244-34e6b1d0316e"
                  ) && (
                    <NavLink exact to="/categorias">
                      <i className="mdi mdi-clipboard" />
                      <span className="hide-menu">Categorías </span>
                    </NavLink>
                  )}
                </li>
                {/*---GESTION*/}
                <li
                  className={
                    this.props.location.pathname === RoutesPath.GESTIONES ||
                    this.props.location.pathname ===
                      RoutesPath.GESTIONES_NUEVA ||
                    this.props.location.pathname ===
                      RoutesPath.GESTIONES_HISTORIAL
                      ? "active"
                      : ""
                  }
                >
                  {" "}
                  {this.state.modulos.includes(
                    "3ba1f88d-3cf1-4bc2-90c4-74a5388acb10"
                  ) && (
                    <NavLink exact to="/gestiones">
                      <i className="mdi mdi-clipboard" />
                      <span className="hide-menu">Gestiones</span>
                    </NavLink>
                  )}
                </li>
                {/*---/GESTION*/}
                <li
                  className={
                    this.props.location.pathname === "/productos" ||
                    this.props.location.pathname === "/productos/new" ||
                    this.props.location.pathname.includes("/productos/update")
                      ? "active"
                      : ""
                  }
                >
                  {" "}
                  {this.state.modulos.includes(
                    "6506804a-90e0-40a5-8522-5fd094005f71"
                  ) && (
                    <NavLink exact to="/productos">
                      <i className="mdi mdi-cart" />
                      <span className="hide-menu">Productos </span>
                    </NavLink>
                  )}
                </li>

                <li
                  className={
                    this.props.location.pathname === "/clientes" ||
                    this.props.location.pathname === "/clientes/new" ||
                    this.props.location.pathname.includes("/clientes/update")
                      ? "active"
                      : ""
                  }
                >
                  {" "}
                  {this.state.modulos.includes(
                    "6e7719cb-ec27-41db-8330-bc36a612bd85"
                  ) && (
                    <NavLink exact to="/clientes">
                      <i className="mdi mdi-account-card-details" />
                      <span className="hide-menu">Clientes </span>
                    </NavLink>
                  )}
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
                      "b2368e0e-cf14-4168-bfb6-68b851781fbe"
                    ) && (
                      <li>
                        <NavLink to="/administracion/usuarios">
                          <i className="mdi mdi-account mr-1" />
                          <span>Usuarios</span>
                        </NavLink>
                      </li>
                    )}
                    {this.state.modulos.includes(
                      "c85623b9-d6a6-44ea-a72c-011c5f4a13d7"
                    ) && (
                      <li>
                        <NavLink to="/administracion/tasas_iva">
                          <i className="mdi mdi-gavel mr-1" />
                          <span>Tasas IVA</span>
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

                <li>
                  {" "}
                  <a
                    className="has-arrow waves-effect waves-dark"
                    href={this.hrefLink}
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-arrange-send-backward" />
                    <span className="hide-menu">Multi level dd</span>
                  </a>
                  <ul className="collapse">
                    <li>
                      <a href={this.hrefLink}>item 1.1</a>
                    </li>
                    <li>
                      <a href={this.hrefLink}>item 1.2</a>
                    </li>
                    <li>
                      {" "}
                      <a
                        className="has-arrow"
                        href={this.hrefLink}
                        aria-expanded="false"
                      >
                        Menu 1.3
                      </a>
                      <ul className="collapse">
                        <li>
                          <a href={this.hrefLink}>item 1.3.1</a>
                        </li>
                        <li>
                          <a href={this.hrefLink}>item 1.3.2</a>
                        </li>
                        <li>
                          <a href={this.hrefLink}>item 1.3.3</a>
                        </li>
                        <li>
                          <a href={this.hrefLink}>item 1.3.4</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href={this.hrefLink}>item 1.4</a>
                    </li>
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
