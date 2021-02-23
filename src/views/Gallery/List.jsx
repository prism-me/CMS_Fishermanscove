import React, { Component } from 'react';
import API from 'utils/http';
import { DropzoneArea } from 'material-ui-dropzone';
import { Box } from '@material-ui/core';
import { CloudUploadOutlined } from '@material-ui/icons';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

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
    let currentFiles = [...this.state.currentFiles, ...files];
    this.setState({ currentFiles })
  }

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <DropzoneArea
            // showPreviews={true}
            Icon={CloudUploadOutlined}
            showAlerts={false}
            acceptedFiles={['image/*']}
            filesLimit={15}
            showPreviewsInDropzone={true}
            showFileNamesInPreview={true}
            onDrop={this.handleFileDrop}
            // useChipsForPreview
            dropzoneText="Drag and Drop Images here or simply click here"
            previewGridProps={{ container: { spacing: 1, direction: 'row', wrap: 'nowrap', style: { overflowX: 'auto', padding: '1rem' } }, item: { xs: 3 } }}
            // previewChipProps={}
            previewText="Selected files"
          />
        </Box>
        <Box>
          <GridList cellHeight={200} className="" spacing={10}>
            {this.state.tileData.map((tile) => (
              <GridListTile cols={0.5} key={tile.img}>
                <img src={tile.img} alt={tile.title} />
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>by: {tile.author}</span>}
                  actionIcon={
                    <IconButton aria-label={`info about ${tile.title}`} className="">
                      <InfoIcon style={{color:'rgba(255,255,255,0.6)'}} />
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