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

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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


export default function AddSustainability() {
  const classes = useStyles();
  const [sustainability, setSustainability] = useState({
    intro: {
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: -1,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: ''
    },
    pillars: {
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: -1,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: ''
    },
    projects: {
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: -1,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: ''
    },
    energy: {
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: -1,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avatar_alt: ''
    },
  })

  const handleInputChange = (e, section) => {
    let updatedSustainability = { ...sustainability };
    updatedSustainability[section][e.target.name] = e.target.value;
    setSustainability(updatedSustainability);
  }

  const handleFileChange = (e, section) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    createImage(files[0], section);
  }

  const createImage = (file, section) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      let updatedSustainability = { ...sustainability };
      updatedSustainability[section]["section_avatar"] = e.target.result;
      setSustainability(updatedSustainability);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add Sustainability Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Intro Section</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={sustainability.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.intro.section_content} onChange={(e) => setSustainability({ ...sustainability, intro: { ...sustainability.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Fragment>
                      <input
                        color="primary"
                        accept="image/*"
                        type="file"
                        onChange={(e) => handleFileChange(e, "intro")}
                        id="section_avatar_intro"
                        name="section_avatar_intro"
                        style={{ display: 'none', }}
                      />
                      <label htmlFor="section_avatar_intro" style={{ width: '100%' }}>
                        <Button
                          variant="contained"
                          component="span"
                          className={classes.button}
                          size="large"
                          color="primary"
                          fullWidth
                        >
                          <Image className={classes.extendedIcon} /> Upload Section Image
                        </Button>
                      </label>
                    </Fragment>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={sustainability.intro.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 2 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>Projects Section</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={sustainability.projects.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.projects.section_content} onChange={(e) => setSustainability({ ...sustainability, projects: { ...sustainability.projects, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Fragment>
                      <input
                        color="primary"
                        accept="image/*"
                        type="file"
                        onChange={(e) => handleFileChange(e, "projects")}
                        id="section_avatar_projects"
                        name="section_avatar_projects"
                        style={{ display: 'none', }}
                      />
                      <label htmlFor="section_avatar_projects" style={{ width: '100%' }}>
                        <Button
                          variant="contained"
                          component="span"
                          className={classes.button}
                          size="large"
                          color="primary"
                          fullWidth
                        >
                          <Image className={classes.extendedIcon} /> Upload Section Image
                        </Button>
                      </label>
                    </Fragment>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={sustainability.projects.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 3 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>Projects Section</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={9}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={sustainability.projects.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.projects.section_content} onChange={(e) => setSustainability({ ...sustainability, projects: { ...sustainability.projects, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Fragment>
                      <input
                        color="primary"
                        accept="image/*"
                        type="file"
                        onChange={(e) => handleFileChange(e, "projects")}
                        id="section_avatar_projects"
                        name="section_avatar_projects"
                        style={{ display: 'none', }}
                      />
                      <label htmlFor="section_avatar_projects" style={{ width: '100%' }}>
                        <Button
                          variant="contained"
                          component="span"
                          className={classes.button}
                          size="large"
                          color="primary"
                          fullWidth
                        >
                          <Image className={classes.extendedIcon} /> Upload Section Image
                        </Button>
                      </label>
                    </Fragment>
                    <TextField
                      required
                      id="section_avatar_alt"
                      name="section_avatar_alt"
                      label="Image Alt Text"
                      value={sustainability.projects.section_avatar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
