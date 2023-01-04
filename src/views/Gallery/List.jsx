import React, { Component } from "react";
import LangAPI from "langapi/http";
import API from "utils/http";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Avatar,
  Box,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Button,
} from "@material-ui/core";
import {
  CloudUploadOutlined,
  DeleteForever,
  DeleteOutlined,
  DeleteRounded,
  VisibilityOutlined,
  VisibilityRounded,
} from "@material-ui/icons";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import CardBody from "components/Card/CardBody";
import Lightbox from "react-image-lightbox";
import UpdateGalleryDialog from "./UpdateGalleryDialog";

class GalleryList extends Component {
  state = {
    showEditBox: false,
    selectedImage: null,
    mainSrc: null,
    currentFiles: [],
    gallery: [],
    photoIndex: 0,
  };

  componentDidMount() {
    LangAPI.get("/get_all_images")
      .then((response) => {
        if (response.status === 200) {
          this.setState({ gallery: response.data.data });
          // this.setState({ mainSrc: response.data.data[0] });
          console.log(response.data.data);
        }
      })
      .catch((err) => {
        alert(
          "SORRY ! Couldn't fetch gallery images, please try again by refreshing the page."
        );
      });
  }

  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ?")) {
      LangAPI.delete(`/offers/${id}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Offer deleted successfully !");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  handleFileDrop = (files) => {
    let updatedFiles = files.map((x) => ({
      image: x,
      is360: false,
      alt_text: "",
    }));
    let currentFiles = [...this.state.currentFiles, ...updatedFiles];
    this.setState({ currentFiles });
  };

  handleImageAltChange = (e, index) => {
    let updatedFiles = [...this.state.currentFiles];
    updatedFiles[index].alt_text = e.target.value;
    this.setState({ currentFiles: updatedFiles });
  };

  handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    this.state.currentFiles.forEach((x) => {
      imagesFormData.append("images[]", x.image);
      imagesFormData.append("data[]", JSON.stringify(x));
    });
    console.log("imagesFormData :: ", imagesFormData);
    LangAPI.post(`/upload_media`, imagesFormData, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${imagesFormData._boundary}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert(response?.data?.message || "Success");
          this.setState({ currentFiles: [] });
        }
      })
      .then(() => {
        LangAPI.get("/get_all_images").then((response) => {
          if (response.status === 200) {
            this.setState({ gallery: response.data.data });
            this.setState({ mainSrc: response.data.data[0] });
          }
        });
      })
      .catch((err) => alert("Something went wrong"));
  };

  handleDelete = (id) => {
    LangAPI.delete(`/delete_images/${id}`)
      .then((response) => {
        if (response.status === 200) {
          alert("Image delete successfully.");
          // this.setState({currentFiles: []})
        }
      })
      .then(() => {
        LangAPI.get("/get_all_images").then((response) => {
          if (response.status === 200) {
            this.setState({ gallery: response.data.data });
            this.setState({ mainSrc: response.data.data[0] });
          }
        });
      })
      .catch((err) => alert("Something went wrong"));
  };

  render() {
    return (
      <div>
        {/* <h2 className="text-center main-title mb-4">Gallery</h2> */}

        <Box marginBottom={4}>
          <DropzoneArea
            // showPreviews={true}
            dropzoneClass="dropzone-wrapper-small"
            Icon={CloudUploadOutlined}
            showAlerts={false}
            acceptedFiles={["image/*"]}
            filesLimit={15}
            showPreviewsInDropzone={false}
            showFileNamesInPreview={false}
            onDrop={this.handleFileDrop}
            // useChipsForPreview
            dropzoneText="Drag and Drop Images here or simply click here"
            previewGridProps={{
              container: {
                spacing: 1,
                direction: "row",
                wrap: "nowrap",
                style: { overflowX: "auto", padding: "1rem" },
              },
              item: { xs: 3 },
            }}
            // previewChipProps={}
            previewText="Selected files"
          />
        </Box>
        {this.state.currentFiles?.length > 0 && (
          <Box marginBottom={4}>
            <Card>
              <CardBody>
                <form type="post" encType="multipart/form-data">
                  <h4 className="mb-4">Selected Images</h4>
                  <Grid container spacing={2}>
                    {this.state.currentFiles?.map((x, i) => (
                      <>
                        <Grid item xs={12} sm={1}>
                          <Avatar
                            src={URL.createObjectURL(x.image)}
                            alt={x.alt_text || ""}
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            required
                            id={`alt_text${i}`}
                            name="alt_text"
                            label="Image Alt Text"
                            value={x.alt_text}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => this.handleImageAltChange(e, i)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              aria-label="is360"
                              row
                              defaultChecked
                              name="is360"
                              value={x.is360}
                              onChange={(e) => {
                                this.setState({
                                  currentFiles: this.state.currentFiles.map(
                                    (y, ind) => {
                                      if (ind === i) {
                                        return { ...y, is360: !y.is360 };
                                      } else {
                                        return y;
                                      }
                                    }
                                  ),
                                });
                              }}
                            >
                              <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label="Regular/Slider"
                              />
                              <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label={
                                  <span>
                                    360<sup>o</sup> View
                                  </span>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              this.setState({
                                currentFiles: [
                                  ...this.state.currentFiles.filter(
                                    (z, index) => index !== i
                                  ),
                                ],
                              })
                            }
                          >
                            <DeleteOutlined />
                          </Button>
                        </Grid>
                      </>
                    ))}
                    {this.state.currentFiles.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <Button
                          variant="contained"
                          size="large"
                          color="primary"
                          onClick={this.handleMultipleSubmit}
                          style={{ float: "right", marginTop: "1rem" }}
                        >
                          Upload New Images
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </CardBody>
            </Card>
          </Box>
        )}
        <Box>
          <GridList cellHeight={150} className="" spacing={10}>
            {this.state.gallery.map((tile, index) => (
              <GridListTile className="gallery-tile" cols={0.4} key={tile._id}>
                <img
                  src={process.env.REACT_APP_IMAGE_BASE_URL + tile.url}
                  alt={tile.alt_tag}
                  onClick={() => {
                    this.setState({ selectedImage: this.state.gallery[index] });
                    this.setState({ showEditBox: true });
                  }}
                />
                <GridListTileBar
                  title={<small>{tile.alt_tag}</small>}
                  // subtitle={<span>by: {tile.author}</span>}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.alt_tag}`}
                      onClick={() => this.handleDelete(tile._id)}
                      className=""
                    >
                      <DeleteRounded
                        fontSize="small"
                        color="secondary"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </Box>
        <Box>
          <UpdateGalleryDialog
            open={this.state.showEditBox}
            onClose={() => this.setState({ showEditBox: false })}
            image={this.state.selectedImage}
          />
        </Box>
      </div>
    );
  }
}

export default GalleryList;
