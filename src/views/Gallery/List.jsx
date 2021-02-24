import React, { Component } from 'react';
import API from 'utils/http';
import { DropzoneArea } from 'material-ui-dropzone';
import { Avatar, Box, Card, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Button } from '@material-ui/core';
import { CloudUploadOutlined, DeleteOutlined } from '@material-ui/icons';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import CardBody from 'components/Card/CardBody';

class GalleryList extends Component {
  state = {
    currentFiles: [],
    tileData: [
      {
        img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
        title: 'Junior suite',
        author: ''
      },
      {
        img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
        title: 'Deluxe suite',
        author: ''
      },
      {
        img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
        title: 'Luxury Room',
        author: ''
      },
      {
        img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
        title: 'Luxury Room',
        author: ''
      },
      {
        img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
        title: 'Luxury Room',
        author: ''
      },
    ]
  }

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
    }).catch(err => {
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

  handleFileDrop = (files) => {
    let updatedFiles = files.map(x => (
      {
        image: x,
        is360: false,
        alt_text: ""
      }
    ))
    let currentFiles = [...this.state.currentFiles, ...updatedFiles];
    this.setState({ currentFiles })
  }

  handleImageAltChange = (e, index) => {
    let updatedFiles = [...this.state.currentFiles];
    updatedFiles[index].alt_text = e.target.value;
    this.setState({ currentFiles: updatedFiles })
  }

  handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    this.state.currentFiles.forEach(x => {
      imagesFormData.append("images[]", x.image);
      imagesFormData.append("data[]", JSON.stringify(x))
    })
    API.post(`/multiple_upload`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      }
    }).then(response => {
      if (response.status === 200) {
        alert("Files Uploaded");
        // this.setState({currentFiles: []})
      }
    }).catch(err => alert("Something went wrong"));

  }

  render() {
    return (
      <div>
        {/* <h2 className="text-center main-title mb-4">Gallery</h2> */}

        <Box marginBottom={4}>
          <DropzoneArea
            // showPreviews={true}
            dropzoneClass="dropzone-wrapper"
            Icon={CloudUploadOutlined}
            showAlerts={false}
            acceptedFiles={['image/*']}
            filesLimit={15}
            showPreviewsInDropzone={false}
            showFileNamesInPreview={false}
            onDrop={this.handleFileDrop}
            // useChipsForPreview
            dropzoneText="Drag and Drop Images here or simply click here"
            previewGridProps={{ container: { spacing: 1, direction: 'row', wrap: 'nowrap', style: { overflowX: 'auto', padding: '1rem' } }, item: { xs: 3 } }}
            // previewChipProps={}
            previewText="Selected files"
          />
        </Box>
        {
          this.state.currentFiles?.length > 0 &&
          <Box marginBottom={4}>
            <Card>
              <CardBody>
                <form type="post" encType="multipart/form-data">

                  <h4 className="mb-4">Selected Images</h4>
                  <Grid container spacing={2}>
                    {
                      this.state.currentFiles?.map((x, i) => (
                        <>
                          <Grid item xs={12} sm={1}>
                            <Avatar src={URL.createObjectURL(x.image)} alt={x.alt_text || ""} />
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
                              <RadioGroup aria-label="is360" row defaultChecked name="is360" value={x.is360} onChange={(e) => {
                                this.setState({
                                  currentFiles: this.state.currentFiles.map((y, ind) => {
                                    if (ind === i) {
                                      return { ...y, is360: !y.is360 }
                                    } else {
                                      return y
                                    }
                                  })
                                })
                              }}>
                                <FormControlLabel value={false} control={<Radio />} label="Regular/Slider" />
                                <FormControlLabel value={true} control={<Radio />} label={<span>360<sup>o</sup> View</span>} />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={1}>
                            <Button variant="outlined" color="secondary" onClick={() => this.setState({ currentFiles: [...this.state.currentFiles.filter((z, index) => index !== i)] })}>
                              <DeleteOutlined />
                            </Button>
                          </Grid>
                        </>
                      ))
                    }
                    {
                      this.state.currentFiles.length > 0 &&
                      <Grid item xs={12} sm={12}>
                        <Button variant="contained" size="large" color="primary" onClick={this.handleMultipleSubmit} style={{ float: 'right', marginTop: '1rem' }} >
                          Upload New Images
                        </Button>
                      </Grid>
                    }
                  </Grid>
                </form>
              </CardBody>
            </Card>
          </Box>
        }
        <Box>
          <GridList cellHeight={150} className="" spacing={10}>
            {this.state.tileData.map((tile) => (
              <GridListTile cols={0.4} key={tile.img}>
                <img src={tile.img} alt={tile.title} />
                <GridListTileBar
                  title={tile.title}
                  // subtitle={<span>by: {tile.author}</span>}
                  actionIcon={
                    <IconButton aria-label={`info about ${tile.title}`} className="">
                      <InfoIcon style={{ color: 'rgba(255,255,255,0.6)' }} />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </Box>
      </div>
    );
  }
}

export default GalleryList;