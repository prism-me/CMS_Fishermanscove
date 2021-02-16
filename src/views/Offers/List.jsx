import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import { Avatar, Box, Button } from '@material-ui/core';
import { AddOutlined, EditOutlined, ListOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import CategoryDialog from './CategoryDialog';

class OffersList extends Component {
  state = {
    isCategoryFormOpen: false,
    offers: [],
    columns: [
      {
        name: "thumbnail",
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
      {
        name: "short_description",
        label: "Description",
        options: {
          filter: true,
          sort: false,
          customBodyRender: val => (
            val?.length > 100 ? val?.substr(0, 100) + '...' : val
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
                <EditOutlined color="secondary" />
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
      this.setState({ rows })
    })
  }
  handleCategorySubmit = (name) => {
    if (!name || name === "") {
      alert("Please enter category name");
      return;
    }
    API.post('/offer-category', { name }).then(response => {
      if (response?.status === 200) {
        alert(response.data?.message)
      }
    }).catch(err=> {
      alert("Something went wrong.");
    })
  }

  render() {
    const { isCategoryFormOpen } = this.state
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/offers/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
              disableElevation
            >
              Add Offer
            </Button>
          </Link>
          <Button
            variant="outlined"
            className="ml-3"
            color="primary"
            startIcon={<ListOutlined />}
            onClick={() => this.setState({ isCategoryFormOpen: true })}
          >
            Add Offer Category
          </Button>
        </Box>
        <MUIDataTable
          title="Premium Offers List"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
        />
        {
          isCategoryFormOpen && <CategoryDialog open={isCategoryFormOpen} handleClose={() => this.setState({ isCategoryFormOpen: false })} handleCategorySubmit={this.handleCategorySubmit} />
        }
      </div>
    );
  }
}

export default OffersList;