import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import HTTP from "../../helpers/HTTP";
export default class UIAsynSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
    };
  }
  getInitData() {
    let data = [];

    HTTP.findAll(this.props.apiPath).then((result) => {
      console.log(result);
      result.forEach((element) => {
        data.push({
          label: element.nombre,
          value: element.id,
        });
      });
    });

    return data;
  }
  timer_cuentas = null;
  searchData = (inputValue, callback) => {
    const tempArray = [];

    if (inputValue !== "" && inputValue !== null) {
      clearTimeout(this.timer_cuentas);
      this.timer_cuentas = setTimeout(() => {
        HTTP.findById(inputValue, this.props.apiPath).then((data) => {
          if (data !== false) {
            data.forEach((element) => {
              tempArray.push({
                label: element.nombre,
                value: element.id,
              });
            });
            callback(tempArray);
          } else {
            callback([]);
          }
        });
      }, 500);
    }
  };
  componentDidMount() {
    this.setState({ items: this.getInitData() });
  }

  render() {
    return (
      <div className={this.props.divClass}>
        <label>{this.props.label}</label>
        <AsyncSelect
          isDisabled={this.state.items === null || this.props.isDisabled}
          id={this.props.id}
          name={this.props.id}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          defaultOptions={this.state.items}
          loadOptions={this.searchData}
          noOptionsMessage={() => {
            return "No existen datos";
          }}
        />
        {this.props.afterSelect}
      </div>
    );
  }

  static defaultProps = {
    id: "id",
    value: "valor",
    placeholder: "Selecciona una opción",
    isDisabled: false,
    onChange: () => {
      console.log("input sin handler");
    },
    label: "Select Label",
    divClass: "col-lg-3 form-group",
    inputProps: {
      className: "form-control",
    },
  };
}
