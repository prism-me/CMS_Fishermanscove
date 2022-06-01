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
import CKEditor from 'ckeditor4-react';
import { ckEditorConfig } from "utils/data";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import LangAPI from "langapi/http";

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


export default function PageAdd() {
  const classes = useStyles();
  const [leisure, setLeisure] = useState({
    name: '',
    slug:'',
    content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    category_id: -1,
    thumbnail:''
  })

  const handleInputChange = (e) => {
    let updatedLeisure = { ...leisure };
    updatedLeisure[e.target.name] = e.target.value;
    setLeisure(updatedLeisure);
  }

  const handleSubmit = () => {
    LangAPI.post(`/pages`, leisure).then(response => {
      console.log(response);
      if (response.status === 200) {
        alert("Record Updated");
        // setWedding({ ...initialObject }); //resetting the form
        // props.history.push('/admin/weddings');
      }
    }).catch(err => alert("Something went wrong"));
  }
  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add Page</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  value={leisure.name}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
              <TextField
                  required
                  id="slug"
                  name="slug"
                  label="Slug"
                  value={leisure.slug}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                />
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
                    config={ckEditorConfig}
                    onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.short_description} onChange={(e)=> setLeisure({...leisure, short_description: e.editor.getData()})} />

              </Grid>
              <Grid item xs={12} sm={12}>
                <p>Detailed Content</p>
                <CKEditor
                    config={ckEditorConfig}
                    onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.content} onChange={(e)=> setLeisure({...leisure, content: e.editor.getData()})} />
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        <Button color="primary" variant="contained" onClick={handleSubmit}>Add Page</Button>
      </div>
    </div>
  );
}
