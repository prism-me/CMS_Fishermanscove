import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import API from "utils/http";
import { Avatar, Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";

class WeddingList extends Component {
  state = {
    offers: [],
    columns: [
      {
        name: "thumbnail",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val, row) => (
            <Avatar
              alt={row.tableData[row.rowIndex][1]?.toUpperCase()}
              src={val}
            ></Avatar>
          ),
        },
      },
      {
        name: "post_name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "room_type",
      //   label: "Room Type",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customBodyRender: (val) => {
      //       return val === 0 ? 'Room' : 'Suite'
      //     }
      //   }
      // },
      // {
      //   name: "category_name",
      //   label: "Category",
      //   options: {
      //     filter: true,
      //     sort: false,
      //   }
      // },
      // {
      //   name: "short_description",
      //   label: "Description",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customBodyRender: val => (
      //       val.length > 100 ? val.substr(0, 100) + '...' : val
      //     )
      //   }
      // },
      {
        name: "post_content",
        label: "Content",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>{val.length > 100 ? val.substr(0, 100) + "..." : val}</code>
          ),
        },
      },
      {
        name: "id",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val) => (
            <div className="d-flex nowrap">
              <Link to={`/admin/weddings/${val}`}>
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link
                className="ml-2"
                title="Edit"
                to={`/admin/weddings/edit/${val}`}
              >
                <EditOutlined fontSize="small" color="primary" />
              </Link>
              <Link
                className="ml-2"
                title="Delete"
                to={`#`}
                onClick={() => this.handleDelete(val)}
              >
                <DeleteOutlined fontSize="small" color="secondary" />
              </Link>
            </div>
          ),
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
    API.get("/wedding").then((response) => {
      let rows = response.data;
      this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
    });
  }

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ?")) {
      API.delete(`/wedding/${id}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Wedding Item deleted successfully !");
          }
        })
        .then(() => {
          // debugger;
          API.get("/wedding").then((response) => {
            let rows = response.data;
            this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
          });
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/weddings/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Wedding
            </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Weddings"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default WeddingList;
