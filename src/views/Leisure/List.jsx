import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import { Avatar, Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AddOutlined, VisibilityOutlined } from '@material-ui/icons';

class LeisureList extends Component {
  state = {
    offers: [],
    columns: [
      {
        name: "avatar",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val) => (
            <Avatar alt={"Image"} src={val}></Avatar>
          )
        }
      },
      {
        name: "post_name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: "room_type",
        label: "Room Type",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => {
            return val === 0 ? 'Room' : 'Suite'
          }
        }
      },
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
          customBodyRender: val => (
            <code>
              {
                val.length > 100 ? val.substr(0, 100) + '...' : val
              }
            </code>
          )
        }
      },
      {
        name: "id",
        label: "",
        options: {
          filter: false,
          sort: false,
          customBodyRender: val => (
            <Link to={`/admin/dining/${val}`} >
              <VisibilityOutlined color="primary" />
            </Link>
          )
        }
      },
    ],
    rows: []
  }

  options = {
    filterType: "checkbox",
    responsive: "vertical",
  };

  componentDidMount() {
    API.get('/dining').then(response => {
      let rows = response.data;
      // let rows = data.map(x=> {
      //   return {

      //   }
      // })
      this.setState({ rows })
    })
  }

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/whats-on/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Leisure Activity
          </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Leisure Activities"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default LeisureList;