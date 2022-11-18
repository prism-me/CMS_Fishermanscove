import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import API from "langapi/http";

class BlackFridayList extends Component {
  state = {
    columns: [
      {
        name: "firstName",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        options: {
          filter: true,
          sort: false,
        },
      },
    ],
    rows: [],
  };

  options = {
    filterType: "checkbox",
    responsive: "vertical",
  };

  componentDidMount() {
    API.get("/deals").then((response) => {
      let rows = response.data?.data;
      this.setState({ rows });
    });
  }

  render() {
    return (
      <div>
        <MUIDataTable
          title="Black Friday List"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default BlackFridayList;
