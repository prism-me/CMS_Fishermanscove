import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import { Avatar, Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AddOutlined, EditOutlined, VisibilityOutlined } from '@material-ui/icons';
import LangAPI from "langapi/http";
import { array } from 'prop-types';

class PageList extends Component {
  state = {
    offers: [],
    columns: [
      // {
      //   name: "avatar",
      //   label: "Image",
      //   options: {
      //     filter: false,
      //     sort: false,
      //     customBodyRender: (val) => (
      //       <Avatar alt={"Image"} src={val}></Avatar>
      //     )
      //   }
      // },
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        }
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
      // {
      //   name: "post_content",
      //   label: "Content",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customBodyRender: val => (
      //       <code>
      //         {
      //           val.length > 100 ? val.substr(0, 100) + '...' : val
      //         }
      //       </code>
      //     )
      //   }
      // },
      {
        name: "_id",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val, row) => {
            return <Link to={`/admin/pages/${row.tableData?.[row.rowIndex]?.slug}/add/${val}`} >
              {/* <EditOutlined color="primary" /> */}
              <Button size="small" color="primary" variant="outlined">
                Update Sections
              </Button>
            </Link>
          }
        }
      },
    ],
    rows: []
  }

  options = {
    filterType: "checkbox",
    responsive: "vertical",
  };

  // filterBySlug(item) {
  //   if (item.slug = 'blog' || item.slug = 'offers') {
  //     return false
  //   }
  //   return true;
  // }

  componentDidMount() {

    LangAPI.get('/pages').then(response => {
      let rows = response?.data?.data;

      console.log(rows,"rowsrowsrows")
      // let arrByID = arr.filter(filterByID)
      rows = rows.filter((element) => {
        if(element.slug == 'blog' || element.slug == 'offers'){
          return false;
        }
        return true;
      })

      this.setState({ rows })

    })
  }

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/pages/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Page
            </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Site Pages"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default PageList;