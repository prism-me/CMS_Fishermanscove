import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import MaterialButton from '@material-ui/core/Button';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel, Avatar } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
// import ClassicEditor from "../../plugins/ckeditor.js";
// import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams, withRouter } from "react-router-dom";

// ClassicEditor.b

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default withRouter(function AddRoom(props) {
  const classes = useStyles();
  //check if edit or add request
  let { id } = useParams();

  const initialObject = {
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    parent_id: -1,
    thumbnail: '',
    alt_text: '',
    meta_title: '',
    meta_description: '',
    schema_markup: '',
    post_url: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "0,0"
  };
  const [room, setRoom] = useState({ ...initialObject })

  const [roomImages, setRoomImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      setPostId(id);
      API.get(`/rooms/${id}/edit`).then(response => {
        if (response.status === 200) {
          setRoom({ ...room, ...response?.data?.content[0] })
        }
      })
    }
  }, [])

  const handleInputChange = (e) => {
    let updatedRoom = { ...room };
    updatedRoom[e.target.name] = e.target.value;
    setRoom(updatedRoom);
  }

  const handleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0]);
  }

  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      setRoom({ ...room, thumbnail: e.target.result });
      if (isEdit) {
        API.patch(`update_upload/${post_id}/rooms-suites`, {
          thumbnail: e.target.result
        }).then(response => {
          console.log(response)
        })
      }
    };
    reader.readAsDataURL(file);
  }


  const handleMultipleFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    let imagesObject = [];

    Object.entries(files).map((x, i) => {
      return imagesObject.push({
        avatar: x[1],
        post_id,
        alt_tag: '',
        is360: false
      });
    })
    setRoomImages([...roomImages, ...imagesObject])
  }

  const handleImageAltChange = (e, index) => {
    let updatedRoomImages = [...roomImages];
    updatedRoomImages[index].alt_tag = e.target.value;
    setRoomImages(updatedRoomImages)
  }

  const handleMultipleSubmit = () => {
    let imagesFormData = new FormData();
    roomImages.forEach(x => {
      imagesFormData.append("images", x)
    })
    API.post(`/multiple_upload`, imagesFormData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
      }
    }).then(response => {
      if (response.status === 200) {
        alert("Images uploaded successfully");
        setRoomImages([]);
        props.history.push('/admin/room-suites');
      }
    }).catch(err => alert("Something went wrong"));

  }


  const handleSubmit = () => {
    let finalRoom = room;
    finalRoom.is_indexed_or_is_followed = `${finalRoom.is_indexed},${finalRoom.is_followed}`
    if (isEdit) {
      API.put(`/rooms/${id}`, finalRoom).then(response => {
        console.log(response);
        if (response.status === 200) {
          alert("Record Updated")
          setRoom({ ...initialObject }); //clear all fields
          props.history.push('/admin/room-suites');
        }
      })
    }
    else {
      API.post('/rooms', finalRoom).then(response => {
        console.log(response);
        if (response.status === 200) {
          setPostId(response.data?.post_id);
          alert('Record Updated');
          setRoom({ ...initialObject });
          props.history.push('/admin/room-suites');
        }
      })
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add Room/Suite</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 className="mt-1">General Information</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="post_name"
                  name="post_name"
                  label="Name"
                  value={room.post_name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="alt_text"
                  name="alt_text"
                  label="Image Alt Text"
                  value={room.alt_text}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                    id="thumbnail"
                    name="thumbnail"
                    style={{ display: 'none', }}
                  />
                  <label htmlFor="thumbnail">
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.button}
                      // size="sm"
                      color="primary"
                      style={{ margin: 0, height: 'auto', }}
                    >
                      <Image className={classes.extendedIcon} /> {isEdit ? 'Change' : 'Upload'} Featured Image
                    </Button>
                  </label>
                </Fragment>
                {
                  isEdit &&
                  <Avatar src={room.thumbnail} alt={room.alt_text} className="float-left mr-4" />
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
                  <InputLabel id="room_type-label">Type</InputLabel>
                  <Select
                    labelId="room_type-label"
                    id="room_type"
                    name="room_type"
                    value={room.room_type}
                    onChange={handleInputChange}
                    label="Type"
                    fullWidth
                  >
                    <MenuItem value={-1}>
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Room</MenuItem>
                    <MenuItem value={2}>Suite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" size="small" fullWidth className={classes.formControl}>
                  <InputLabel id="parent_id-label">Category</InputLabel>
                  <Select
                    labelId="parent_id-label"
                    id="parent_id"
                    name="parent_id"
                    value={room.parent_id}
                    onChange={handleInputChange}
                    label="Category"
                    fullWidth
                  >
                    <MenuItem value={-1}>
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Family</MenuItem>
                    <MenuItem value={2}>Deluxe</MenuItem>
                    <MenuItem value={3}>Partial Ocean View</MenuItem>
                    <MenuItem value={4}>Full Ocean View</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Short Description</p>
                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={room.short_description} onChange={(e) => setRoom({ ...room, short_description: e.editor.getData() })} />
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Detailed Content</p>

                <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={room.post_content} onChange={(e) => setRoom({ ...room, post_content: e.editor.getData() })} />

              </Grid>
            </Grid>
            <h4 className="mt-2">SEO Information</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_title"
                  name="meta_title"
                  label="Meta Title"
                  value={room.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="post_url"
                  name="post_url"
                  label="Permalink"
                  value={room.post_url}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="meta_description"
                  name="meta_description"
                  label="Meta Description"
                  value={room.meta_description}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  id="schema_markup"
                  name="schema_markup"
                  label="Schema Markup"
                  value={room.schema_markup}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  rowsMax={4}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={room.is_followed} onChange={(e) => {
                    setRoom({ ...room, is_followed: !room.is_followed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Follow" />
                    <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={room.is_indexed} onChange={(e) => {
                    setRoom({ ...room, is_indexed: !room.is_indexed })
                  }}>
                    <FormControlLabel value={true} control={<Radio />} label="Index" />
                    <FormControlLabel value={false} control={<Radio />} label="No Index" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
                  Submit
                </MaterialButton>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        {isEdit &&
          <Card>
            <CardBody>
              <h3>Room Images</h3>
              <p><em>Please select multiple images and fill out the alt_text for each image.</em></p>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  {roomImages.length < 1 &&
                    <Fragment>
                      <input
                        color="primary"
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={handleMultipleFileChange}
                        id="thumbnailMultiple"
                        name="thumbnailMultiple"
                        style={{ display: 'none', }}
                        disabled={post_id > 0 ? false : true}
                      />
                      <label htmlFor="thumbnailMultiple">
                        <Button
                          variant="contained"
                          component="span"
                          className={classes.button}
                          size="large"
                          disabled={post_id > 0 ? false : true}
                          color="primary"
                          style={{ margin: 0, height: '100%', }}
                        >
                          <Image className={classes.extendedIcon} /> Select Multiple Images
                    </Button>
                      </label>
                    </Fragment>
                  }
                </Grid>
                {
                  roomImages?.map((x, i) => (
                    <Fragment>
                      <Grid item xs={12} sm={2}>
                        <Avatar src={URL.createObjectURL(x.avatar)} alt={x.alt_tag} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          required
                          id={`alt_tag${i}`}
                          name="alt_tag"
                          label="Image Alt Text"
                          value={x.alt_tag}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleImageAltChange(e, i)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl component="fieldset">
                          <RadioGroup aria-label="is360" row defaultChecked name="is360" value={x.is360} onChange={(e) => {
                            setRoomImages(roomImages.map((y, ind) => {
                              if (ind === i) {
                                return { ...y, is360: !y.is360 }
                              } else {
                                return y
                              }
                            }))
                          }}>
                            <FormControlLabel value={false} control={<Radio />} label="Regular/Slider" />
                            <FormControlLabel value={true} control={<Radio />} label={<span>360<sup>o</sup> View</span>} />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <MaterialButton variant="outlined" color="secondary" onClick={() => setRoomImages([...roomImages.filter((z, index) => index !== i)])}>
                          <DeleteOutlined />
                        </MaterialButton>
                      </Grid>
                    </Fragment>
                  ))
                }
                {
                  roomImages.length > 0 &&
                  <Grid item xs={12} sm={12}>
                    <MaterialButton variant="contained" size="large" color="primary" style={{ float: 'right' }} onClick={handleMultipleSubmit}>
                      Upload/Update Images
                  </MaterialButton>
                  </Grid>
                }
              </Grid>
            </CardBody>
          </Card>
        }
      </div>
    </div>
  );
})
