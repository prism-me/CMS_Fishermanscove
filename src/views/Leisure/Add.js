import React, { Fragment, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField } from "@material-ui/core";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";

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


export default function LeisureAdd() {
  const classes = useStyles();
  const [leisure, setLeisure] = useState({
    post_name: '',
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    category_id: -1,
    thumbnail:''
  })

  const handleInputChange = (e) => {
    let updatedLeisure = { ...leisure };
    updatedLeisure[e.target.name] = e.target.value;
    setLeisure(updatedLeisure);
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Add Leisure Activity</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="post_name"
                  name="post_name"
                  label="Name"
                  value={leisure.post_name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                  <InputLabel id="category_id-label">Category</InputLabel>
                  <Select
                    labelId="category_id-label"
                    id="category_id"
                    name="category_id"
                    value={leisure.category_id}
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
              <Grid item xs={6} sm={6}>
                <Fragment>
                  <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    onChange={handleInputChange}
                    id="thumbnail"
                    name="thumbnail"
                    style={{ display: 'none', }}
                  />
                  <label htmlFor="thumbnail">
                    <Button
                      variant="contained"
                      component="span"
                      className={classes.button}
                      size="large"
                      color="primary"
                    >
                      <Image className={classes.extendedIcon} /> Upload Featured Image
                    </Button>
                  </label>
                </Fragment>
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Short Description</p>
                <CKEditor
                  editor={ClassicEditor}
                  data={leisure.short_description}
                  // config={{
                  //   toolbar: ['bold', 'italic']
                  // }}
                  onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        "height",
                        "150px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setLeisure({ ...leisure, short_description: data })
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Detailed Content</p>
                <CKEditor
                  editor={ClassicEditor}
                  data={leisure.post_content}
                  // config={{
                  //   toolbar: ['bold', 'italic']
                  // }}
                  onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        "height",
                        "150px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setLeisure({ ...leisure, post_content: data })
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                  }}
                />
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
