import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import LangAPI from "langapi/http";
import InputLabel from "@material-ui/core/InputLabel";
import {
  Avatar,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";

class WeddingList extends Component {
  state = {
    selectedLang: "en",
    offers: [],
    columns: [
      {
        name: "thumbnailPreview",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val, row) => (
            <Avatar
              alt={row.tableData[row.rowIndex][1]?.toUpperCase()}
              src={process.env.REACT_APP_IMAGE_BASE_URL + val}
            ></Avatar>
          ),
        },
      },
      {
        name: "name",
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
        name: "detailed_content",
        label: "Description",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>
              {val && val.length > 100 ? val.substr(0, 100) + "..." : val}
            </code>
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
                to={`/admin/weddings/${val}?lang=${this.state.selectedLang}`}
              >
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link
                className="ml-2"
                title="Edit"
                to={`/admin/weddings/edit/${val}?lang=${this.state.selectedLang}`}
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
    LangAPI.get(`/weddings?lang=${this.state.selectedLang}`).then(
      (response) => {
        let rows = response?.data?.data;
        console.log(rows, "rowsrowsrows");
        // this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
        this.setState({ rows });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedLang !== this.state.selectedLang) {
      LangAPI.get(`/weddings?lang=${this.state.selectedLang}`).then(
        (response) => {
          let rows = response?.data?.data;
          if (this.state.rows != rows) {
            // this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
            this.setState({ rows });
          }
        }
      );
    }
  }

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ?")) {
      LangAPI.delete(`/weddings/${id}?lang=${this.state.selectedLang}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Wedding Item deleted successfully !");
          }
        })
        .then(() => {
          // debugger;
          LangAPI.get(`/weddings?lang=${this.state.selectedLang}`).then(
            (response) => {
              let rows = response?.data?.data;
              // this.setState({ rows: rows.filter((x) => x.post_type !== "page") });
              this.setState({ rows });
            }
          );
        })
        .catch((err) => console.log(err));
    }
  };

  handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != this.state.selectedLang) {
      this.setState({ selectedLang: event.target.value });
    }
    console.log(event.target.value, "event.target.value");
  };

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/admin/weddings/add">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlined />}
              >
                Add Wedding
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
                <MenuItem value={"en"}>En</MenuItem>
                <MenuItem value={"fr"}>FR</MenuItem>
                <MenuItem value={"de"}>DE</MenuItem>
                <MenuItem value={"ru"}>RU</MenuItem>
              </Select>
            </FormControl>
          </div>
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
