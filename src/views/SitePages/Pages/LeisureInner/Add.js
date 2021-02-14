import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MaterialButton from "@material-ui/core/Button";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, CardMedia, CardActionArea, CardContent, CardActions } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import API from "utils/http";

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


export default function AddLeisureInner() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [leisureInner, setLeisureInner] = useState({
    lounge: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'lounge'
    },
    snorkeling: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'snorkeling'
    },
    kayaking: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'kayaking'
    },
    marine: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'marine'
    },
    others: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'others'
    },
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setLeisureInner(
          {
            lounge: data.find(x => x.section_slug === "lounge") || leisureInner.lounge,
            kayaking: data.find(x => x.section_slug === "kayaking") || leisureInner.kayaking,
            snorkeling: data.find(x => x.section_slug === "snorkeling") || leisureInner.snorkeling,
            marine: data.find(x => x.section_slug === "marine") || leisureInner.marine,
            others: data.find(x => x.section_slug === "others") || leisureInner.others,
          }
        )
      }
    })
  }, [])
  const handleInputChange = (e, section) => {
     
    let updatedLeisureInner = { ...leisureInner };
    updatedLeisureInner[section][e.target.name] = e.target.value;
    setLeisureInner(updatedLeisureInner);
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
      let updatedLeisureInner = { ...leisureInner };
      updatedLeisureInner[section]["section_avatar"] = e.target.result;
      setLeisureInner(updatedLeisureInner);
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = (id, name) => {
    API.put(`/add_section/${id}`, leisureInner[name]).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Add LeisureInner Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Lounge by the Pool</Typography>
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
                      value={leisureInner.lounge.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "lounge")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.lounge.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "lounge")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {leisureInner.lounge.section_avatar && leisureInner.lounge.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={leisureInner.lounge.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "lounge")}
                            id="section_avatar_lounge"
                            name="section_avatar_lounge"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_lounge" style={{ width: '100%', margin: 0 }}>
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
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(leisureInner.lounge.id, "lounge")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
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
                <Typography className={classes.heading}>Snorkeling</Typography>
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
                      value={leisureInner.kayaking.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "kayaking")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.kayaking.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, kayaking: { ...leisureInner.kayaking, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.kayaking.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "kayaking")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {leisureInner.kayaking.section_avatar && leisureInner.kayaking.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={leisureInner.kayaking.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "kayaking")}
                            id="section_avatar_kayaking"
                            name="section_avatar_kayaking"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_kayaking" style={{ width: '100%', margin: 0 }}>
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
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(leisureInner.kayaking.id, "kayaking")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
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
                <Typography className={classes.heading}>Kayaking</Typography>
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
                      value={leisureInner.snorkeling.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "snorkeling")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.snorkeling.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, snorkeling: { ...leisureInner.snorkeling, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.snorkeling.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "snorkeling")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {leisureInner.snorkeling.section_avatar && leisureInner.snorkeling.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={leisureInner.snorkeling.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "snorkeling")}
                            id="section_avatar_snorkeling"
                            name="section_avatar_snorkeling"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_snorkeling" style={{ width: '100%', margin: 0 }}>
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
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(leisureInner.snorkeling.id, "snorkeling")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ****************** */}
            {/* SECTION 4 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel4a-header"
              >
                <Typography className={classes.heading}>Discover the Marine Life</Typography>
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
                      value={leisureInner.marine.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "marine")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.marine.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, marine: { ...leisureInner.marine, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.marine.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "marine")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {leisureInner.marine.section_avatar && leisureInner.marine.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={leisureInner.marine.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "marine")}
                            id="section_avatar_marine"
                            name="section_avatar_marine"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_marine" style={{ width: '100%', margin: 0 }}>
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
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(leisureInner.marine.id, "marine")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>



            {/* ****************** */}
            {/* SECTION 5 */}
            {/* ****************** */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5a-content"
                id="panel5a-header"
              >
                <Typography className={classes.heading}>Others</Typography>
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
                      value={leisureInner.others.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "others")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.others.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, others: { ...leisureInner.others, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.others.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "others")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        {leisureInner.others.section_avatar && leisureInner.others.section_avatar !== "" ?
                          <CardMedia
                            component="img"
                            alt=""
                            height="140"
                            image={leisureInner.others.section_avatar}
                            title=""
                          />
                          :
                          <CardContent>
                            <Typography variant="body2" component="h2">
                              Please add an Image
                          </Typography>
                          </CardContent>
                        }
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <input
                            color="primary"
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFileChange(e, "others")}
                            id="section_avatar_others"
                            name="section_avatar_others"
                            style={{ display: 'none', }}
                          />
                          <label htmlFor="section_avatar_others" style={{ width: '100%', margin: 0 }}>
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
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(leisureInner.marine.id, "marine")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
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
