import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import { Avatar, Box, Button } from '@material-ui/core';
import { AddOutlined, DeleteOutlined, EditOutlined, ListOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import CategoryDialog from './CategoryDialog';

class GalleryList extends Component {
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
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: val => (
            <div className="d-flex nowrap">
              <Link title="View Details" to={`/admin/gallery/${val}`} >
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link className="ml-2" title="Edit" to={`/admin/gallery/edit/${val}`} >
                <EditOutlined fontSize="small" color="primary" />
              </Link>
              <Link className="ml-2" title="Delete" to={`#`} onClick={() => this.handleDelete(val)} >
                <DeleteOutlined fontSize="small" color="secondary" />
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

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ?')) {
      API.delete(`/offers/${id}`).then(response => {
        if (response.status === 200) {
          alert("Offer deleted successfully !");
        }
      }).catch(err => console.log(err))
    }
  }

  render() {
    const { isCategoryFormOpen } = this.state
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/gallery/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
              disableElevation
            >
              Add Gallery Images
            </Button>
          </Link>
          <Button
            variant="outlined"
            className="ml-3"
            color="primary"
            startIcon={<ListOutlined />}
            onClick={() => this.setState({ isCategoryFormOpen: true })}
          >
            Add Gallery Category
          </Button>
        </Box>
        <MUIDataTable
          title="Gallery List"
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

export default GalleryList;