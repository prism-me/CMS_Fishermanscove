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

const website_url = "https://fishermanscove-resort.com/";

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


export default function AddAboutSeychelles() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const initialObject = {
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
    features: {
      id: 0,
      section_name: 'features list',
      section_content: [],
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'features'
    }
  }

  const [seoInfo, setSeoInfo] = useState({
    id: 0,
    post_id: pageId || 0,
    meta_title: '',
    meta_description: '',
    route: website_url,
    schema_markup: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: '1,1',
  })

  const [aboutSeychelles, setAboutSeychelles] = useState({ ...initialObject })
  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(true)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setAboutSeychelles(
          {
            intro: data.find(x => x.section_slug === "intro") || initialObject.intro,
            features: initialObject.features,
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
    API.get(`/meta`).then(response => {
      if (response.status === 200) {
        let seoInfoData = response.data?.find(x => x.post_id == pageId);
        if (seoInfoData) {
          seoInfoData.is_indexed = JSON.parse(seoInfoData.is_indexed)
          seoInfoData.is_followed = JSON.parse(seoInfoData.is_followed)
        }
        else {
          seoInfoData = seoInfo
        }
        setSeoInfo(seoInfoData);
      }
    })
  }

  const handleInputChange = (e, section) => {

    let updatedDiningInner = { ...aboutSeychelles };
    updatedDiningInner[section][e.target.name] = e.target.value;
    setAboutSeychelles(updatedDiningInner);
  }

  const handleImageSelect = (e, index, section) => {
    if (e.target.checked) {
      if (isSingle && thumbnailPreview !== "") {
        alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
        return;
      } else {
        setAboutSeychelles({ ...aboutSeychelles, [section]: { ...aboutSeychelles[section], section_avatar: imagesData[index].id } })
        setThumbnailPreview(imagesData[index].avatar)

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
      }
    } else {
      setAboutSeychelles({ ...aboutSeychelles, [section]: { ...aboutSeychelles[section], section_avatar: "" } })
      setThumbnailPreview("")

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


  const handleLinkChange = (e, index, section) => {
    let updatedAboutSeychelles = { ...aboutSeychelles };
    updatedAboutSeychelles[section].section_content[index][e.target.name] = e.target.value;
    setAboutSeychelles(updatedAboutSeychelles);
  }
  const addNewLink = () => {
    let updatedAboutSeychelles = { ...aboutSeychelles };
    updatedAboutSeychelles.features.section_content.push({ id: aboutSeychelles.features.section_content?.length + 1, title: '', description: '' });
    setAboutSeychelles(updatedAboutSeychelles);
  }


  const handleSEOInputChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    updatedSeoInfo[e.target.name] = e.target.value;
    setSeoInfo(updatedSeoInfo);
  }

  const handleRouteChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
    updatedValue = updatedValue.replace(/--/g, '-')
    updatedSeoInfo[e.target.name] = website_url + updatedValue;
    setSeoInfo(updatedSeoInfo);
  }

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
    API.put(`/add_section/${id}`, JSON.stringify(aboutSeychelles[name]), {
      headers: {
        'Content-Type': 'application/json'
      }
    } ).then(response => {
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
            <h4 className="mb-0">Add About Seychelles Information</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Intro</Typography>
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
                      value={aboutSeychelles.intro.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                      style={{ marginBottom: '1rem' }}
                    />
                    {/* CKEDITOR  */}
                    <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={aboutSeychelles.intro.section_content} onChange={(e) => setAboutSeychelles({ ...aboutSeychelles, intro: { ...aboutSeychelles.intro, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={aboutSeychelles.intro.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "intro")}
                      size="small"
                    />
                    <Card className={classes.root}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !aboutSeychelles.intro.id > 0 ?
                              thumbnailPreview && thumbnailPreview !== "" ?
                                <img src={thumbnailPreview} alt={aboutSeychelles.intro.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (aboutSeychelles.intro.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview} alt={aboutSeychelles.intro.section_avtar_alt || ""} />
                                :
                                <img src={aboutSeychelles.intro.section_avatar} alt={aboutSeychelles.intro.section_avtar_alt || ""} />
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
                    <MaterialButton onClick={() => handleSubmit(aboutSeychelles.intro.id, "intro")} size="large" color="primary" variant="contained">
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
                <Typography className={classes.heading}>Features</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-4"></h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MaterialButton
                      variant="outlined"
                      component="span"
                      className={classes.button}
                      size="small"
                      color="primary"
                      onClick={() => addNewLink()}
                    >
                      Add a New Link
                    </MaterialButton>
                  </Grid>
                  {
                    aboutSeychelles?.features?.section_content?.map((x, index) => (
                      <React.Fragment>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            required
                            id={`title${x.id}`}
                            name="title"
                            label="Link Text"
                            value={x.title}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            rowsMax={2}
                            onChange={(e) => handleLinkChange(e, index, 'features')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id={`description${x.id}`}
                            name="description"
                            label="Short Description"
                            value={x.description}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            rowsMax={2}
                            onChange={(e) => handleLinkChange(e, index, 'features')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <MaterialButton onClick={() => setAboutSeychelles({ ...aboutSeychelles, features: { ...aboutSeychelles.features, section_content: aboutSeychelles.features.section_content.filter(z => z.id !== x.id) } })} color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                            Delete Link
                          </MaterialButton>
                        </Grid>
                      </React.Fragment>
                    ))
                  }
                  <Grid item xs={12} sm={12}>
                    <MaterialButton disabled={aboutSeychelles.features.section_content < 1} onClick={() => handleSubmit(aboutSeychelles.features.id, "features")} color="primary" variant="contained">
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="route"
                      name="route"
                      label="Permalink"
                      value={seoInfo.route}
                      variant="outlined"
                      fullWidth
                      onChange={handleRouteChange}
                      size="small"
                    />
                  </Grid>
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
