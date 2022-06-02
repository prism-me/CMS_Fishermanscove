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
import LangAPI from "langapi/http";
import avatar from "assets/img/faces/marc.jpg";
import { FormControl, FormControlLabel, Radio, RadioGroup, Select, TextField, CardMedia, CardActionArea, CardContent, CardActions, MenuItem } from "@material-ui/core";
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


export default function AddLeisureInner() {
  const pageId = useParams().id;
  const classes = useStyles();
  let leisureObj = {
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
  }

  let seoObj = {
    id: 0,
    post_id: pageId || 0,
    meta_title: '',
    meta_description: '',
    // route: website_url,
    schema_markup: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: '1,1',
  }

  const [leisureInner, setLeisureInner] = useState(leisureObj)

  const [seoInfo, setSeoInfo] = useState(seoObj)

  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(true)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [selectedLang, setSelectedLang] = useState("en");
  const [thumbnailPreview, setThumbnailPreview] = useState({
    banner: "",
    lounge: "",
    snorkeling: "",
    kayaking: "",
    marine: "",
    others: "",
  })

  useEffect(() => {
    LangAPI.get(`/all-sections/${pageId}/${selectedLang}`).then(response => {
      if (response?.status === 200) {
        if(response?.data?.data[0]){
          setLeisureInner(response.data.data[0])
          setSeoInfo(response?.data?.data[0]?.meta)
        } else {
          setLeisureInner(leisureObj)
          setSeoInfo(seoObj)
        }
        
      }
    });
    if(!imagesData.length > 0){
      getGalleryImages();
    }
  }, [selectedLang])

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
          // seoInfoData({...seoInfo});
          setSeoInfo(seoInfoData);
        }
      }
    })
  }

  const handleInputChange = (e, section) => {

    let updatedLeisureInner = { ...leisureInner };
    updatedLeisureInner[section][e.target.name] = e.target.value;
    setLeisureInner(updatedLeisureInner);
  }

  const handleImageSelect = (e, index, section) => {
    setTimeout(() => {
      setShowGallery(false);
    }, 500);

    if (e.target.checked) {
      // if (isSingle && thumbnailPreview !== "") {
      //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
        setLeisureInner({ ...leisureInner, [section]: { ...leisureInner[section], section_avatar: imagesData[index] } })
        // setThumbnailPreview(imagesData[index].avatar)
        setThumbnailPreview({...thumbnailPreview, [section]: imagesData[index].avatar })
      // }
    } else {
      setLeisureInner({ ...leisureInner, [section]: { ...leisureInner[section], section_avatar: "" } })
      // setThumbnailPreview("")
      setThumbnailPreview({...thumbnailPreview, [section]: "" })

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

    let updatedAbout = { ...leisureInner };
    updatedAbout.meta = {...seoInfo};
    updatedAbout.page_id = pageId
    updatedAbout.slug="liesureInner-sections"
    // console.log("updatedAbout",updatedAbout); return false;

    LangAPI.post(`/add-section?lang=${selectedLang}`, updatedAbout).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))

  }

  const handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != selectedLang) {
        setSelectedLang(event.target.value)
    }
  };


  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Add Leisure Inner Sections</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            <FormControl
                variant="outlined"
                size="small"
                style={{ width: "20%", color: "white" }}
            // fullWidth
            >
                <InputLabel id="language"
                    style={{ color: "white" }}
                >Select Language</InputLabel>
                <Select
                    labelId="language"
                    id="language"
                    name="language"
                    value={selectedLang}
                    label="Select Language"
                    fullWidth
                    style={{ color: "white" }}
                    onChange={handleChange}
                >
                    <MenuItem value={'en'}>En</MenuItem>
                    <MenuItem value={'fr'}>FR</MenuItem>
                    <MenuItem value={'de'}>DE</MenuItem>

                </Select>
            </FormControl>
          </CardHeader>
          <CardBody>
            {/* ******************* */}
            {/* SECTION BANNER */}
            {/* ******************* */}
            <Accordion defaultExpanded>
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
                      value={leisureInner.banner.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "banner")}
                      size="medium"
                      style={{ marginBottom: '1rem' }}
                    />

                    <div className="thumbnail-preview-wrapper-large img-thumbnail">
                      {
                        !leisureInner.banner.id > 0 ?
                        leisureInner.banner.section_avatar?.avatar !== "" ?
                            <img src={leisureInner.banner.section_avatar?.avatar} alt={leisureInner.banner.section_avtar_alt || ""} />
                            :
                            <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                          :
                          typeof (leisureInner.banner.section_avatar?.avatar) === typeof (0) ?
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img src={thumbnailPreview["banner"]} alt={leisureInner.banner.section_avtar_alt || ""} />
                            :
                            <img src={leisureInner.banner.section_avatar?.avatar} alt={leisureInner.banner.section_avtar_alt || ""} />
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
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.lounge.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "lounge")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !leisureInner.lounge.id > 0 ?
                              leisureInner.lounge.section_avatar?.avatar !== "" ?
                                <img src={leisureInner.lounge.section_avatar?.avatar} alt={leisureInner.lounge.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisureInner.lounge.section_avatar?.avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["lounge"]} alt={leisureInner.lounge.section_avtar_alt || ""} />
                                :
                                <img src={leisureInner.lounge.section_avatar?.avatar} alt={leisureInner.lounge.section_avtar_alt || ""} />
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
                              setCurrentSection("lounge");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.kayaking.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, kayaking: { ...leisureInner.kayaking, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.kayaking.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "kayaking")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !leisureInner.kayaking.id > 0 ?
                              leisureInner.kayaking.section_avatar?.avatar !== "" ?
                                <img src={leisureInner.kayaking.section_avatar?.avatar} alt={leisureInner.kayaking.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisureInner.kayaking.section_avatar?.avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["kayaking"]} alt={leisureInner.kayaking.section_avtar_alt || ""} />
                                :
                                <img src={leisureInner.kayaking.section_avatar?.avatar} alt={leisureInner.kayaking.section_avtar_alt || ""} />
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
                              setCurrentSection("kayaking");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.snorkeling.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, snorkeling: { ...leisureInner.snorkeling, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.snorkeling.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "snorkeling")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !leisureInner.snorkeling.id > 0 ?
                              leisureInner.snorkeling.section_avatar?.avatar !== "" ?
                                <img src={leisureInner.snorkeling.section_avatar?.avatar} alt={leisureInner.snorkeling.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisureInner.snorkeling.section_avatar?.avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["snorkeling"]} alt={leisureInner.snorkeling.section_avtar_alt || ""} />
                                :
                                <img src={leisureInner.snorkeling.section_avatar?.avatar} alt={leisureInner.snorkeling.section_avtar_alt || ""} />
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
                              setCurrentSection("snorkeling");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.marine.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, marine: { ...leisureInner.marine, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.marine.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "marine")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !leisureInner.marine.id > 0 ?
                            leisureInner.marine.section_avatar?.avatar !== "" ?
                                <img src={leisureInner.marine.section_avatar?.avatar} alt={leisureInner.marine.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisureInner.marine.section_avatar?.avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["marine"]} alt={leisureInner.marine.section_avtar_alt || ""} />
                                :
                                <img src={leisureInner.marine.section_avatar?.avatar} alt={leisureInner.marine.section_avtar_alt || ""} />
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
                              setCurrentSection("marine");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                    <CKEditor
                        config={ckEditorConfig}
                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.others.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, others: { ...leisureInner.others, section_content: e.editor.getData() } })} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    {/* <TextField
                      required
                      id="section_avtar_alt"
                      name="section_avtar_alt"
                      label="Image Alt Text"
                      value={leisureInner.others.section_avtar_alt}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "others")}
                      size="small"
                    /> */}
                    <Card className={classes.root} style={{ marginTop: 0 }}>
                      <CardActionArea>
                        <div className="thumbnail-preview-wrapper-small img-thumbnail">
                          {
                            !leisureInner.others.id > 0 ?
                              leisureInner.others.section_avatar?.avatar !== "" ?
                                <img src={leisureInner.others.section_avatar?.avatar} alt={leisureInner.others.section_avtar_alt || ""} />
                                :
                                <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisureInner.others.section_avatar) === typeof (0) ?
                                // dining.thumbnail && dining.thumbnail !== "" ?
                                <img src={thumbnailPreview["others"]} alt={leisureInner.others.section_avtar_alt || ""} />
                                :
                                <img src={leisureInner.others.section_avatar?.avatar} alt={leisureInner.others.section_avtar_alt || ""} />
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
                              setCurrentSection("others");
                              setShowGallery(true);
                            }}
                          >
                            Upload Featured Image
                          </MaterialButton>
                        </Fragment>
                      </CardActions>
                    </Card>
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
                  <Grid item xs={12} sm={12}>
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
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
        <Grid item xs={12} sm={12}>
          <MaterialButton onClick={() => handleSubmit(leisureInner.marine.id, "marine")} size="large" color="primary" variant="contained">
            Update Section
          </MaterialButton>
        </Grid>
      </div>
      <GalleryDialog isSingle={isSingle} section={currentSection} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
        setShowGallery(false);
        // setRenderPreviews(true);
      }} refreshGallery={getGalleryImages} data={imagesData} />
      {/* GALLERY DIALOG BOX END */}
    </div>
  );
}
