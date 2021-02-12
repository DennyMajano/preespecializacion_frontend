import React from "react";

function Footer(props) {
  var date = new Date();
  var year = date.getFullYear();
  return (
    <React.Fragment>
      <footer className="footer">
        © {year} {process.env.REACT_APP_COPY}
        <div className="pull-right">
          POWER BY:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://arielclaros.com"
          >
            Ariel Claros
          </a>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Footer;
