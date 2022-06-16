import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import API from 'utils/http';
import LangAPI from "langapi/http";
import { Avatar, Box, Button, Select, MenuItem, FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import { AddOutlined, DeleteOutlined, EditOutlined, ListOutlined, VisibilityOutlined } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import CategoryDialog from './CategoryDialog';

class OffersList extends Component {
  state = {
    isCategoryFormOpen: false,
    selectedLang: "en",
    offers: [],
    columns: [
      {
        name: "thumbnailPreview",
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
        name: "is_premium",
        label: "Room Type",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => {
            return val === 0 ? 'Other Offer' : 'Premium Offer'
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
        name: "slug",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: val => (
            <div className="d-flex nowrap">
              <Link title="View Details" to={`/admin/premium-offers/${val}?lang=${this.state.selectedLang}`} >
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link className="ml-2" title="Edit" to={`/admin/premium-offers/edit/${val}?lang=${this.state.selectedLang}`} >
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
    LangAPI.get(`/offers?lang=${this.state.selectedLang}`).then(response => {
      let rows = response?.data?.data?.filter((x) => x?.is_premium === 1);
      this.setState({ rows })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedLang !== this.state.selectedLang) {
      LangAPI.get(`/offers?lang=${this.state.selectedLang}`).then((response) => {
        let rows = response?.data?.data?.filter((x) => x?.is_premium === 1);
        if (this.state.rows != rows) {
          // this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
          this.setState({ rows });
        }
      });
    }
  }

  handleCategorySubmit = (category_name) => {
    if (!category_name || category_name === "") {
      alert("Please enter category name");
      return;
    }
    // API.post('/offer_categories/offers', { category_name }).then(response => {
    //   if (response?.status === 200) {
    //     alert(response.data?.message);
    //     this.setState({ isCategoryFormOpen: false })
    //   }
    // }).catch(err => {
    //   alert("Something went wrong.");
    // })
  }

  handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ?')) {
      LangAPI.delete(`/offers/${id}?lang=${this.state.selectedLang}`).then(response => {
        if (response.status === 200) {
          alert("Offer deleted successfully !");
        }
      })
        .then(() => {
          LangAPI.get(`/offers?lang=${this.state.selectedLang}`).then(response => {
            let rows = response?.data?.data?.filter((x) => x?.is_premium === 1);
            this.setState({ rows })
          })
        })
        .catch(err => console.log(err))
    }
  }

  handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != this.state.selectedLang) {
      this.setState({ selectedLang: event.target.value })
    }
    console.log(event.target.value, "event.target.value")
  };

  render() {
    const { isCategoryFormOpen } = this.state
    return (
      <div>
        <Box marginBottom={4}>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/admin/premium-offers/add">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlined />}
                disableElevation
              >
                Add Offer
              </Button>
            </Link>
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%" }}
            // fullWidth
            >
              <InputLabel id="language">Select Language</InputLabel>
              <Select
                labelId="language"
                id="language"
                name="language"
                value={this.state.selectedLang}
                // onChange={handleInputChange}
                label="Select Language"
                fullWidth
                onChange={this.handleChange}
              >
                {/* <MenuItem value={-1}>
                        <em>Select Language</em>
                    </MenuItem> */}
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>FR</MenuItem>
                <MenuItem value={'de'}>DE</MenuItem>

              </Select>
            </FormControl>
          </div>
          {/* <Button
            variant="outlined"
            className="ml-3"
            color="primary"
            startIcon={<ListOutlined />}
            onClick={() => this.setState({ isCategoryFormOpen: true })}
          >
            Add Offer Category
          </Button> */}
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