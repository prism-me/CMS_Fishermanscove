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
import { FormControl, FormControlLabel, Radio, RadioGroup, Select, TextField, CardMedia, CardActionArea, CardContent, CardActions } from "@material-ui/core";
import CKEditor from 'ckeditor4-react';
import { ckEditorConfig } from "utils/data";
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
import GalleryDialog from "views/Common/GalleryDialog";

// const website_url = "https://fishermanscove-resort.com/";
// const website_url = "/";

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
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [sustainability, setSustainability] = useState({
    banner: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'banner'
    },
    intro: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'intro'
    },
    pillars: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'pillars'
    },
    projects: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'projects'
    },
    energy: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'energy'
    },
  })

  const [seoInfo, setSeoInfo] = useState({
    id: 0,
    post_id: pageId || 0,
    meta_title: '',
    meta_description: '',
    // route: website_url,
    schema_markup: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: '1,1',
  })

  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(true)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState({
    banner: "",
    intro: "",
    pillars: "",
    projects: "",
    energy: ""
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setSustainability(
          {
            intro: data.find(x => x.section_slug === "intro") || sustainability.intro,
            projects: data.find(x => x.section_slug === "projects") || sustainability.projects,
            pillars: data.find(x => x.section_slug === "pillars") || sustainability.pillars,
            energy: data.find(x => x.section_slug === "energy") || sustainability.energy,
            banner: data.find(x => x.section_slug === "banner") || sustainability.banner,

          }
        )
      }
    });
    getGalleryImages();
    getSEOInfo();
  }, [])

  const getGalleryImages = () => {
    API.get(`/uploads`).then(response => {
      if (response.status === 200) {
        setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
      }
    })
  }

  const getSEOInfo = () => {
    API.get(`/meta/${pageId}`).then(response => {
      if (response.status === 200) {
        let seoInfoData = response.data;
        if (seoInfoData) {
          setSeoInfo(seoInfoData);
        }
        else {
          seoInfoData(seoInfo);
        }
      }
    })
  }

  const handleInputChange = (e, section) => {
    let updatedSustainability = { ...sustainability };
    updatedSustainability[section][e.target.name] = e.target.value;
    setSustainability(updatedSustainability);
  }

  const handleImageSelect = (e, index, section) => {
    setTimeout(() => {
      setShowGallery(false)
    }, 500)
    if (e.target.checked) {
      // if (isSingle && thumbnailPreview !== "") {
      //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      setSustainability({ ...sustainability, [section]: { ...sustainability[section], section_avatar: imagesData[index].id } })
      setThumbnailPreview({ ...thumbnailPreview, [section]: imagesData[index].avatar })

      let imagesDataUpdated = imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: true
          }
        } else {
          return x
        }
      });
      setImagesData(imagesDataUpdated);
      // }
    } else {
      setSustainability({ ...sustainability, [section]: { ...sustainability[section], section_avatar: "" } })
      setThumbnailPreview({ ...thumbnailPreview, [section]: "" })

      setImagesData(imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: false
          }
        } else {
          return x
        }
      }));
    }
  }


  const handleSEOInputChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    updatedSeoInfo[e.target.name] = e.target.value;
    setSeoInfo(updatedSeoInfo);
  }

  // const handleRouteChange = (e) => {
  //   let updatedSeoInfo = { ...seoInfo };
  //   let splitValues = e.target.value.split(website_url);
  //   let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
  //   updatedValue = updatedValue.replace(/--/g, '-')
  //   updatedSeoInfo[e.target.name] = website_url + updatedValue;
  //   setSeoInfo(updatedSeoInfo);
  // }

  const handleSEOSubmit = () => {
    let updatedSeoInfo = seoInfo;
    updatedSeoInfo.is_indexed_or_is_followed = `${updatedSeoInfo.is_indexed},${updatedSeoInfo.is_followed}`;

    if (updatedSeoInfo.id > 0) {
      API.put(`/meta/${pageId}`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))
    } else {
      API.post(`/meta`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))

    }
  }

  const handleSubmit = (id, name) => {
    API.post(`/add_section`, sustainability[name]).then(response => {
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
            <h4 className="mb-0">Add Sustainability Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            {/* ******************* */}
            {/* SECTION BANNER */}
            {/* ******************* */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelaa-content"
                id="panelaa-header"
              >
                <Typography className={classes.heading}>Banner</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={sustainability.banner.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "banner")}
                      size="medium"
                      style={{ marginBottom: '1rem' }}
                    />

                    <div className="thumbnail-preview-wrapper-large img-thumbnail">
                      {
                        !sustainability.banner.id > 0 ?
                          thumbnailPreview["banner"] !== "" ?
                            <img src={thumbnailPreview["banner"]} alt={sustainability.banner.section_avtar_alt || ""} />
                            :
                            <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                          :
                          typeof (sustainability.banner.section_avatar) === typeof (0) ?
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img src={thumbnailPreview["banner"]} alt={sustainability.banner.section_avtar_alt || ""} />
                            :
                            <img src={sustainability.banner.section_avatar} alt={sustainability.banner.section_avtar_alt || ""} />
                      }
                    </div>
                    <Fragment>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        startIcon={<Image />}
                        className="mt-1"
                        fullWidth
                        size="large"
                        onClick={() => {
                          setIsSingle(true);
                          setCurrentSection("banner");
                          setShowGallery(true);
                        }}
                      >
                        Upload Featured Image
                          </MaterialButton>
                    </Fragment>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(sustainability.banner.id, "banner")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            {/* ******************* */}
            {/* SECTION 1 */}
            {/* ******************* */}
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
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.intro.section_content} onChange={(e) => setSustainability({ ...sustainability, intro: { ...sustainability.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt_intro"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.intro.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !sustainability.intro.id > 0 ?
                              thumbnailPreview["intro"] !== "" ?
                                <img src={thumbnailPreview["intro"]} alt={sustainability.intro.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (sustainability.intro.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["intro"]} alt={sustainability.intro.section_avtar_alt || ""} />
                                :
                                <img src={sustainability.intro.section_avatar} alt={sustainability.intro.section_avtar_alt || ""} />
                          }
                        </div>
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <MaterialButton
                            variant="contained"
                            color="primary"
                            startIcon={<Image />}
                            className="mt-1"
                            fullWidth
                            onClick={() => {
                              setIsSingle(true);
                              setCurrentSection("intro");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(sustainability.intro.id, "intro")} size="large" color="primary" variant="contained">
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
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.projects.section_content} onChange={(e) => setSustainability({ ...sustainability, projects: { ...sustainability.projects, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt_projects"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.projects.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "projects")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !sustainability.projects.id > 0 ?
                              thumbnailPreview["projects"] !== "" ?
                                <img src={thumbnailPreview["projects"]} alt={sustainability.projects.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (sustainability.projects.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["projects"]} alt={sustainability.projects.section_avtar_alt || ""} />
                                :
                                <img src={sustainability.projects.section_avatar} alt={sustainability.projects.section_avtar_alt || ""} />
                          }
                        </div>
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <MaterialButton
                            variant="contained"
                            color="primary"
                            startIcon={<Image />}
                            className="mt-1"
                            fullWidth
                            onClick={() => {
                              setIsSingle(true);
                              setCurrentSection("projects");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(sustainability.projects.id, "projects")} size="large" color="primary" variant="contained">
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
                <Typography className={classes.heading}>Pillars Section</Typography>
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
                      value={sustainability.pillars.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "pillars")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.pillars.section_content} onChange={(e) => setSustainability({ ...sustainability, pillars: { ...sustainability.pillars, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt_pillars"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.pillars.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "pillars")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !sustainability.pillars.id > 0 ?
                              thumbnailPreview["pillars"] !== "" ?
                                <img src={thumbnailPreview["pillars"]} alt={sustainability.pillars.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (sustainability.pillars.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["pillars"]} alt={sustainability.pillars.section_avtar_alt || ""} />
                                :
                                <img src={sustainability.pillars.section_avatar} alt={sustainability.pillars.section_avtar_alt || ""} />
                          }
                        </div>
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <MaterialButton
                            variant="contained"
                            color="primary"
                            startIcon={<Image />}
                            className="mt-1"
                            fullWidth
                            onClick={() => {
                              setIsSingle(true);
                              setCurrentSection("pillars");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(sustainability.pillars.id, "pillars")} size="large" color="primary" variant="contained">
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
                <Typography className={classes.heading}>Energy Conversation Section</Typography>
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
                      value={sustainability.energy.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "energy")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={sustainability.energy.section_content} onChange={(e) => setSustainability({ ...sustainability, energy: { ...sustainability.energy, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt_energy"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={sustainability.energy.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "energy")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !sustainability.energy.id > 0 ?
                              thumbnailPreview["energy"] !== "" ?
                                <img src={thumbnailPreview["energy"]} alt={sustainability.energy.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (sustainability.energy.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["energy"]} alt={sustainability.energy.section_avtar_alt || ""} />
                                :
                                <img src={sustainability.energy.section_avatar} alt={sustainability.energy.section_avtar_alt || ""} />
                          }
                        </div>
                      </CardActionArea>
                      <CardActions>
                        <Fragment>
                          <MaterialButton
                            variant="contained"
                            color="primary"
                            startIcon={<Image />}
                            className="mt-1"
                            fullWidth
                            onClick={() => {
                              setIsSingle(true);
                              setCurrentSection("energy");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={() => handleSubmit(sustainability.energy.id, "energy")} size="large" color="primary" variant="contained">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>SEO Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="meta_title"
                      name="meta_title"
                      label="Meta Title"
                      value={seoInfo.meta_title}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*  <span>https://fishermanscove-resort.com</span>*/}
                  {/*</Grid>*/}
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*  <TextField*/}
                  {/*    required*/}
                  {/*    id="route"*/}
                  {/*    name="route"*/}
                  {/*    label="Permalink"*/}
                  {/*    value={seoInfo.route}*/}
                  {/*    variant="outlined"*/}
                  {/*    fullWidth*/}
                  {/*    onChange={handleRouteChange}*/}
                  {/*    size="small"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="meta_description"
                      name="meta_description"
                      label="Meta Description"
                      value={seoInfo.meta_description}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="schema_markup"
                      name="schema_markup"
                      label="Schema Markup"
                      value={seoInfo.schema_markup}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      rowsMax={4}
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={seoInfo.is_followed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_followed: !seoInfo.is_followed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Follow" />
                        <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={seoInfo.is_indexed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_indexed: !seoInfo.is_indexed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Index" />
                        <FormControlLabel value={false} control={<Radio />} label="No Index" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton onClick={handleSEOSubmit} variant="contained" color="primary" size="large">
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
      </div>
      <GalleryDialog isSingle={isSingle} section={currentSection} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
        setShowGallery(false);
        // setRenderPreviews(true);
      }} refreshGallery={getGalleryImages} data={imagesData} />
      {/* GALLERY DIALOG BOX END */}
    </div>
  );
}
