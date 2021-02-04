import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import { Avatar, Box, Button } from '@material-ui/core';
import { AddOutlined, EditOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';

class OffersList extends Component {
  state = {
    offers: [],
    columns: [
      {
        name: "thumbnail",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender:(val) => (
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
      {
        name: "short_description",
        label: "Description",
        options: {
          filter: true,
          sort: false,
          customBodyRender: val=>(
            val?.length > 100 ? val?.substr(0,100) + '...' : val
          )
        }
      },
      // {
      //   name: "post_content",
      //   label: "Content",
      //   options: {
      //     filter: true,
      //     sort: false,
      //   }
      // },
      {
        name: "id",
        label: null,
        options: {
          filter: false,
          sort: false,
          customBodyRender: val => (
            <div className="d-flex nowrap">
              <Link title="View Details" to={`/admin/offers/${val}`} >
                <VisibilityOutlined color="primary" />
              </Link>
              <Link className="ml-2" title="Edit" to={`/admin/offers/edit/${val}`} >
                <EditOutlined color="secondary"  />
              </Link>
            </div>
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
    API.get('/offers').then(response => {
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
          <Link to="/admin/offers/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Offer
          </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Premium Offers List"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
        />
      </div>
    );
  }
}

export default OffersList;