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

class RoomsList extends Component {
  state = {
    offers: [],
    columns: [
      {
        name: "img",
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
        name: "title",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "short_description",
        label: "Description",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>{val?.length > 100 ? val?.substr(0, 100) + "..." : val}</code>
          ),
        },
      },
      {
        name: "slug",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val) => (
            <div className="d-flex nowrap">
              <Link
                title="View Details"
                to={`/admin/blogs/${val}`}
              >
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link
                className="ml-2"
                title="Edit"
                to={`/admin/blogs/edit/${val}`}
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
    API.get("/blogs").then((response) => {
      let rows = response.data?.data;
      this.setState({ rows });
    });
  }

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ?")) {
      API.delete(`/blogs/${id}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Blog deleted successfully !");
          }
        })
        .then(() => {
          API.get("/blogs").then((response) => {
            let rows = response.data?.data;
            this.setState({ rows });
          });
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/blogs/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Blog
            </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Blogs"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default RoomsList;
