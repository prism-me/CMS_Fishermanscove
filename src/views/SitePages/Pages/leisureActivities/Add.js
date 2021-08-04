// import React, { Fragment, useEffect, useState } from "react";
// // @material-ui/core components
// import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
// // core components
// // import GridItem from "components/Grid/GridItem.js";
// // import GridContainer from "components/Grid/GridContainer.js";
// // import CustomInput from "components/CustomInput/CustomInput.js";
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
//
// import MaterialButton from "@material-ui/core/Button";
// import Button from "components/CustomButtons/Button.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";
//
// import avatar from "assets/img/faces/marc.jpg";
// import { FormControl, FormControlLabel, Radio, RadioGroup, Select, TextField, CardMedia, CardActionArea, CardContent, CardActions } from "@material-ui/core";
// import CKEditor from 'ckeditor4-react';
//
// // import { CKEditor } from '@ckeditor/ckeditor5-react';
// // import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
// import { Image } from "@material-ui/icons";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { useParams } from "react-router-dom";
// import API from "utils/http";
// import GalleryDialog from "views/Common/GalleryDialog";
// import FAQSection from "../Common/FAQSection";
//
// const website_url = "https://fishermanscove-resort.com/";
//
// const useStyles = makeStyles((theme) => ({
//   root: {
//     // flexGrow: 1,
//     // width:'60%',
//     // margin:'auto'
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));
//
//
// export default function LeisureActivities() {
//   const pageId = parseInt(useParams().id);
//   const classes = useStyles();
//   const [leisure, setLeisure] = useState({
//     banner: {
//       id: 0,
//       section_name: '',
//       section_content: "<p>Detailed content goes here!</p>",
//       page_id: pageId,
//       section_avatar: '',
//       section_col_arr: 0,
//       section_prior: 1,
//       section_avtar_alt: '',
//       section_slug: 'banner'
//     },
//     activities: {
//       id: 0,
//       section_name: '',
//       section_content: "<p>Detailed content goes here!</p>",
//       page_id: pageId,
//       section_avatar: '',
//       section_col_arr: 0,
//       section_prior: 1,
//       section_avtar_alt: '',
//       section_slug: 'activities'
//     },
//     awards: {
//       id: 0,
//       section_name: '',
//       section_content: "<p>Detailed content goes here!</p>",
//       page_id: pageId,
//       section_avatar: '',
//       section_col_arr: 0,
//       section_prior: 1,
//       section_avtar_alt: '',
//       section_slug: 'awards'
//     },
//   });
//
//   const [seoInfo, setSeoInfo] = useState({
//     id: 0,
//     post_id: pageId || 0,
//     meta_title: '',
//     meta_description: '',
//     route: website_url,
//     schema_markup: '',
//     is_followed: true,
//     is_indexed: true,
//     is_indexed_or_is_followed: '1,1',
//   })
//
//   const [currentSection, setCurrentSection] = useState("")
//
//   const [imagesData, setImagesData] = useState([])
//   // const [uploadsPreview, setUploadsPreview] = useState(null)
//   // const [selectedImages, setSelectedImages] = useState([])
//   const [showGallery, setShowGallery] = useState(false)
//   const [isSingle, setIsSingle] = useState(true)
//   // const [renderPreviews, setRenderPreviews] = useState(false)
//   const [thumbnailPreview, setThumbnailPreview] = useState('')
//
//   useEffect(() => {
//     API.get(`/all_sections/${pageId}`).then(response => {
//       if (response?.status === 200) {
//         const { data } = response;
//         setLeisure(
//           {
//             activities: data.find(x => x.section_slug === "activities") || leisure.activities,
//             awards: data.find(x => x.section_slug === "awards") || leisure.awards,
//             banner: data.find(x => x.section_slug === "banner") || leisure.banner,
//           }
//         )
//       }
//     });
//     getGalleryImages();
//     getSEOInfo();
//   }, []);
//
//   const getGalleryImages = () => {
//     API.get(`/uploads`).then(response => {
//       if (response.status === 200) {
//         setImagesData(response.data?.map(x => ({ ...x, isChecked: false })))
//       }
//     })
//   }
//
//   const getSEOInfo = () => {
//     API.get(`/meta/${pageId}`).then(response => {
//       if (response.status === 200) {
//         let seoInfoData = response.data;
//         if (seoInfoData) {
//           setSeoInfo(seoInfoData);
//         }
//         else {
//           seoInfoData(seoInfo);
//         }
//       }
//     })
//   }
//
//   const handleInputChange = (e, section) => {
//     let updatedAbout = { ...leisure };
//     updatedAbout[section][e.target.name] = e.target.value;
//     setLeisure(updatedAbout);
//   }
//
//   const handleImageSelect = (e, index, section) => {
//     setTimeout(() => {
//       setShowGallery(false);
//     }, 500);
//
//     if (e.target.checked) {
//       // if (isSingle && thumbnailPreview !== "") {
//       //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
//       //   return;
//       // } else {
//         setLeisure({ ...leisure, [section]: { ...leisure[section], section_avatar: imagesData[index].id } })
//         setThumbnailPreview(imagesData[index].avatar)
//
//         let imagesDataUpdated = imagesData.map((x, i) => {
//           if (i === index) {
//             return {
//               ...x,
//               isChecked: true
//             }
//           } else {
//             return x
//           }
//         });
//         setImagesData(imagesDataUpdated);
//       // }
//     } else {
//       setLeisure({ ...leisure, [section]: { ...leisure[section], section_avatar: "" } })
//       setThumbnailPreview("")
//
//       setImagesData(imagesData.map((x, i) => {
//         if (i === index) {
//           return {
//             ...x,
//             isChecked: false
//           }
//         } else {
//           return x
//         }
//       }));
//     }
//   }
//
//   const handleSEOInputChange = (e) => {
//     let updatedSeoInfo = { ...seoInfo };
//     updatedSeoInfo[e.target.name] = e.target.value;
//     setSeoInfo(updatedSeoInfo);
//   }
//
//   const handleRouteChange = (e) => {
//     let updatedSeoInfo = { ...seoInfo };
//     let splitValues = e.target.value.split(website_url);
//     let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
//     updatedValue = updatedValue.replace(/--/g, '-')
//     updatedSeoInfo[e.target.name] = website_url + updatedValue;
//     setSeoInfo(updatedSeoInfo);
//   }
//
//   const handleSEOSubmit = () => {
//     let updatedSeoInfo = seoInfo;
//     updatedSeoInfo.is_indexed_or_is_followed = `${updatedSeoInfo.is_indexed},${updatedSeoInfo.is_followed}`;
//
//     if (updatedSeoInfo.id > 0) {
//       API.put(`/meta/${pageId}`, updatedSeoInfo).then(response => {
//         if (response.status === 200) {
//           alert("Section updated successfully !");
//         }
//       }).catch(err => console.log(err))
//     } else {
//       API.post(`/meta`, updatedSeoInfo).then(response => {
//         if (response.status === 200) {
//           alert("Section updated successfully !");
//         }
//       }).catch(err => console.log(err))
//
//     }
//   }
//
//   const handleSubmit = (id, name) => {
//     API.post(`/add_section`, leisure[name]).then(response => {
//       if (response.status === 200) {
//         alert("Section updated successfully !");
//       }
//     }).catch(err => console.log(err))
//   }
//
//   return (
//     <div>
//       <div className={classes.root}>
//         <Card>
//           <CardHeader color="primary">
//             <h4 className="mb-0">Add Leisure Activities Sections</h4>
//             {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
//           </CardHeader>
//           <CardBody>
//             {/* ******************* */}
//             {/* SECTION BANNER */}
//             {/* ******************* */}
//             <Accordion>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panelaa-content"
//                 id="panelaa-header"
//               >
//                 <Typography className={classes.heading}>Banner</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={12}>
//                     {/* SECTION TITLE */}
//                     <TextField
//                       required
//                       id="section_name"
//                       name="section_name"
//                       label="Section Title"
//                       value={leisure.banner.section_name}
//                       variant="outlined"
//                       fullWidth
//                       onChange={(e) => handleInputChange(e, "banner")}
//                       size="medium"
//                       style={{ marginBottom: '1rem' }}
//                     />
//
//                     <div className="thumbnail-preview-wrapper-large img-thumbnail">
//                       {
//                         !leisure.banner.id > 0 ?
//                           thumbnailPreview && thumbnailPreview !== "" ?
//                             <img src={thumbnailPreview} alt={leisure.banner.section_avtar_alt || ""} />
//                             :
//                             <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
//                           :
//                           typeof (leisure.banner.section_avatar) === typeof (0) ?
//                             // dining.thumbnail && dining.thumbnail !== "" ?
//                             <img src={thumbnailPreview} alt={leisure.banner.section_avtar_alt || ""} />
//                             :
//                             <img src={leisure.banner.section_avatar} alt={leisure.banner.section_avtar_alt || ""} />
//                       }
//                     </div>
//                     <Fragment>
//                       <MaterialButton
//                         variant="outlined"
//                         color="primary"
//                         startIcon={<Image />}
//                         className="mt-1"
//                         fullWidth
//                         size="large"
//                         onClick={() => {
//                           setIsSingle(true);
//                           setCurrentSection("banner");
//                           setShowGallery(true);
//                         }}
//                       >
//                         Upload Featured Image
//                           </MaterialButton>
//                     </Fragment>
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <MaterialButton onClick={() => handleSubmit(leisure.banner.id, "banner")} size="large" color="primary" variant="contained">
//                       Update Section
//                     </MaterialButton>
//                   </Grid>
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//             {/* ******************* */}
//             {/* SECTION 1 */}
//             {/* ******************* */}
//             <Accordion>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panel1a-content"
//                 id="panel1a-header"
//               >
//                 <Typography className={classes.heading}>Activities</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={12}>
//                     {/* SECTION TITLE */}
//                     <TextField
//                       required
//                       id="section_name"
//                       name="section_name"
//                       label="Section Title"
//                       value={leisure.activities.section_name}
//                       variant="outlined"
//                       fullWidth
//                       onChange={(e) => handleInputChange(e, "activities")}
//                       size="small"
//                       style={{ marginBottom: '1rem' }}
//                     />
//                     {/* CKEDITOR  */}
//                     {/*<CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.intro.section_content} onChange={(e) => setLeisure({ ...leisure, intro: { ...leisure.intro, section_content: e.editor.getData() } })} />*/}
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     {/* <TextField
//                       required
//                       id="section_avtar_alt"
//                       name="section_avtar_alt"
//                       label="Image Alt Text"
//                       value={about.intro.section_avtar_alt}
//                       variant="outlined"
//                       fullWidth
//                       onChange={(e) => handleInputChange(e, "intro")}
//                       size="small"
//                     /> */}
//                     <Card className={classes.root} style={{ marginTop: 0 }}>
//                       <CardActionArea>
//                         <div className="thumbnail-preview-wrapper-large img-thumbnail">
//                           {
//                             !leisure.activities.id > 0 ?
//                               thumbnailPreview && thumbnailPreview !== "" ?
//                                 <img src={thumbnailPreview} alt={leisure.activities.section_avtar_alt || ""} />
//                                 :
//                                 <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
//                               :
//                               typeof (leisure.activities.section_avatar) === typeof (0) ?
//                                 // dining.thumbnail && dining.thumbnail !== "" ?
//                                 <img src={thumbnailPreview} alt={leisure.activities.section_avtar_alt || ""} />
//                                 :
//                                 <img src={leisure.activities.section_avatar} alt={leisure.activities.section_avtar_alt || ""} />
//                           }
//                         </div>
//                       </CardActionArea>
//                       <CardActions>
//                         <Fragment>
//                           <MaterialButton
//                             variant="contained"
//                             color="primary"
//                             startIcon={<Image />}
//                             className="mt-1"
//                             fullWidth
//                             onClick={() => {
//                               setIsSingle(true);
//                               setCurrentSection("activities");
//                               setShowGallery(true);
//                             }}
//                           >
//                             Upload Featured Image
//                           </MaterialButton>
//                         </Fragment>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <MaterialButton onClick={() => handleSubmit(leisure.activities.id, "activities")} size="large" color="primary" variant="contained">
//                       Update Section
//                     </MaterialButton>
//                   </Grid>
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//             {/* ****************** */}
//             {/* SECTION 2 */}
//             {/* ****************** */}
//             <Accordion>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panel2a-content"
//                 id="panel2a-header"
//               >
//                 <Typography className={classes.heading}>Awards And Certifications</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Grid container spacing={2}>
//                   {/*<Grid item xs={12} sm={12}>*/}
//                   {/*   SECTION TITLE*/}
//                   {/*  <TextField*/}
//                   {/*    required*/}
//                   {/*    id="section_name"*/}
//                   {/*    name="section_name"*/}
//                   {/*    label="Section Title"*/}
//                   {/*    value={leisure.awards.section_name}*/}
//                   {/*    variant="outlined"*/}
//                   {/*    fullWidth*/}
//                   {/*    onChange={(e) => handleInputChange(e, "awards")}*/}
//                   {/*    size="small"*/}
//                   {/*    style={{ marginBottom: '1rem' }}*/}
//                   {/*  />*/}
//                   {/*   CKEDITOR*/}
//                   {/*  <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.dine.section_content} onChange={(e) => setLeisure({ ...leisure, dine: { ...leisure.dine, section_content: e.editor.getData() } })} />*/}
//                   {/*</Grid>*/}
//                   {/*<Grid item xs={12} sm={6}>*/}
//                   {/*  /!* <TextField*/}
//                   {/*    required*/}
//                   {/*    id="section_avtar_alt"*/}
//                   {/*    name="section_avtar_alt"*/}
//                   {/*    label="Image Alt Text"*/}
//                   {/*    value={about.dine.section_avtar_alt}*/}
//                   {/*    variant="outlined"*/}
//                   {/*    fullWidth*/}
//                   {/*    onChange={(e) => handleInputChange(e, "dine")}*/}
//                   {/*    size="small"*/}
//                   {/*  /> *!/*/}
//                   {/*  <Card className={classes.root} style={{ marginTop: 0 }}>*/}
//                   {/*    <CardActionArea>*/}
//                   {/*      <div className="thumbnail-preview-wrapper-small img-thumbnail">*/}
//                   {/*        {*/}
//                   {/*          !leisure.awards.id > 0 ?*/}
//                   {/*              thumbnailPreview["awards"] !== "" ?*/}
//                   {/*                  <img src={thumbnailPreview["awards"]} alt={leisure.awards.section_avtar_alt || ""} />*/}
//                   {/*                  :*/}
//                   {/*                  <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />*/}
//                   {/*              :*/}
//                   {/*              typeof (leisure.awards.section_avatar) === typeof (0) ?*/}
//                   {/*                  // dining.thumbnail && dining.thumbnail !== "" ?*/}
//                   {/*                  <img src={thumbnailPreview["awards"]} alt={leisure.awards.section_avtar_alt || ""} />*/}
//                   {/*                  :*/}
//                   {/*                  <img src={leisure.awards.section_avatar} alt={leisure.awards.section_avtar_alt || ""} />*/}
//                   {/*        }*/}
//                   {/*      </div>*/}
//                   {/*    </CardActionArea>*/}
//                   {/*    <CardActions>*/}
//                   {/*      <Fragment>*/}
//                   {/*        <MaterialButton*/}
//                   {/*            variant="contained"*/}
//                   {/*            color="primary"*/}
//                   {/*            startIcon={<Image />}*/}
//                   {/*            className="mt-1"*/}
//                   {/*            fullWidth*/}
//                   {/*            onClick={() => {*/}
//                   {/*              setIsSingle(true);*/}
//                   {/*              setCurrentSection("awards");*/}
//                   {/*              setShowGallery(true);*/}
//                   {/*            }}*/}
//                   {/*        >*/}
//                   {/*          Upload Featured Image*/}
//                   {/*        </MaterialButton>*/}
//                   {/*      </Fragment>*/}
//                   {/*    </CardActions>*/}
//                   {/*  </Card>*/}
//                   {/*</Grid>*/}
//                   {/*<Grid item xs={12} sm={6}>*/}
//                   {/*  <MaterialButton onClick={() => handleSubmit(leisure.awards.id, "awards")} size="large" color="primary" variant="contained">*/}
//                   {/*    Update Section*/}
//                   {/*  </MaterialButton>*/}
//                   {/*</Grid>*/}
//                   <Grid item xs={12} sm={6}>
//                     {/* <TextField
//                       required
//                       id="section_avtar_alt"
//                       name="section_avtar_alt"
//                       label="Image Alt Text"
//                       value={about.dine.section_avtar_alt}
//                       variant="outlined"
//                       fullWidth
//                       onChange={(e) => handleInputChange(e, "dine")}
//                       size="small"
//                     /> */}
//                     <Card className={classes.root} style={{ marginTop: 0 }}>
//                       <CardActionArea>
//                         <div className="thumbnail-preview-wrapper-small img-thumbnail">
//                           {
//                             !leisure.awards.id > 0 ?
//                               thumbnailPreview && thumbnailPreview !== "" ?
//                                 <img src={thumbnailPreview} alt={leisure.awards.section_avtar_alt || ""} />
//                                 :
//                                 <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
//                               :
//                               typeof (leisure.awards.section_avatar) === typeof (0) ?
//                                 // dining.thumbnail && dining.thumbnail !== "" ?
//                                 <img src={thumbnailPreview} alt={leisure.awards.section_avtar_alt || ""} />
//                                 :
//                                 <img src={leisure.awards.section_avatar} alt={leisure.awards.section_avtar_alt || ""} />
//                           }
//                         </div>
//                       </CardActionArea>
//                       <CardActions>
//                         <Fragment>
//                           <MaterialButton
//                             variant="contained"
//                             color="primary"
//                             startIcon={<Image />}
//                             className="mt-1"
//                             fullWidth
//                             onClick={() => {
//                               setIsSingle(true);
//                               setCurrentSection("awards");
//                               setShowGallery(true);
//                             }}
//                           >
//                             Upload Featured Image
//                           </MaterialButton>
//                         </Fragment>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <MaterialButton onClick={() => handleSubmit(leisure.awards.id, "awards")} size="large" color="primary" variant="contained">
//                       Update Section
//                     </MaterialButton>
//                   </Grid>
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//             <Accordion>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panel2a-content"
//                 id="panel2a-header"
//               >
//                 <Typography className={classes.heading}>SEO Information</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       required
//                       id="meta_title"
//                       name="meta_title"
//                       label="Meta Title"
//                       value={seoInfo.meta_title}
//                       variant="outlined"
//                       fullWidth
//                       onChange={handleSEOInputChange}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       required
//                       id="route"
//                       name="route"
//                       label="Permalink"
//                       value={seoInfo.route}
//                       variant="outlined"
//                       fullWidth
//                       onChange={handleRouteChange}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <TextField
//                       required
//                       id="meta_description"
//                       name="meta_description"
//                       label="Meta Description"
//                       value={seoInfo.meta_description}
//                       variant="outlined"
//                       fullWidth
//                       onChange={handleSEOInputChange}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <TextField
//                       required
//                       id="schema_markup"
//                       name="schema_markup"
//                       label="Schema Markup"
//                       value={seoInfo.schema_markup}
//                       variant="outlined"
//                       fullWidth
//                       multiline
//                       rows={4}
//                       rowsMax={4}
//                       onChange={handleSEOInputChange}
//                       size="small"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl component="fieldset">
//                       <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={seoInfo.is_followed} onChange={(e) => {
//                         setSeoInfo({ ...seoInfo, is_followed: !seoInfo.is_followed })
//                       }}>
//                         <FormControlLabel value={true} control={<Radio />} label="Follow" />
//                         <FormControlLabel value={false} control={<Radio />} label="No Follow" />
//                       </RadioGroup>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl component="fieldset">
//                       <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={seoInfo.is_indexed} onChange={(e) => {
//                         setSeoInfo({ ...seoInfo, is_indexed: !seoInfo.is_indexed })
//                       }}>
//                         <FormControlLabel value={true} control={<Radio />} label="Index" />
//                         <FormControlLabel value={false} control={<Radio />} label="No Index" />
//                       </RadioGroup>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sm={12}>
//                     <MaterialButton onClick={handleSEOSubmit} variant="contained" color="primary" size="large">
//                       Update Section
//                     </MaterialButton>
//                   </Grid>
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//           </CardBody>
//         </Card>
//       </div>
//       <GalleryDialog isSingle={isSingle} section={currentSection} open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
//         setShowGallery(false);
//         // setRenderPreviews(true);
//       }} refreshGallery={getGalleryImages} data={imagesData} />
//     </div>
//   );
// }


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


export default function LeisureActivities() {
  const pageId = parseInt(useParams().id);
  const classes = useStyles();
  const [leisure, setLeisure] = useState({
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
    awards: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'awards'
    },
    excellence: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'excellence'
    },
    activities: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'activities'
    },
    Fishing: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'Fishing'
    },
    Unlock: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'Unlock'
    },
    Water: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'Water'
    },
  })

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

  const [currentSection, setCurrentSection] = useState("")

  const [imagesData, setImagesData] = useState([])
  // const [uploadsPreview, setUploadsPreview] = useState(null)
  // const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(true)
  // const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState({
    banner: "",
    activities: "",
    awards: "",
    excellence: "",
    Fishing: "",
    Unlock: "",
    Water: "",
  })

  useEffect(() => {
    API.get(`/all_sections/${pageId}`).then(response => {
      if (response?.status === 200) {
        const { data } = response;
        setLeisure(
            {
              banner: data.find(x => x.section_slug === "banner") || leisure.banner,
              activities: data.find(x => x.section_slug === "activities") || leisure.activities,
              awards: data.find(x => x.section_slug === "awards") || leisure.awards,
              excellence: data.find(x => x.section_slug === "excellence") || leisure.excellence,
              Fishing: data.find(x => x.section_slug === "Fishing") || leisure.Fishing,
              Unlock: data.find(x => x.section_slug === "Unlock") || leisure.Unlock,
              Water: data.find(x => x.section_slug === "Water") || leisure.Water,
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

    let updatedLeisureInner = { ...leisure };
    updatedLeisureInner[section][e.target.name] = e.target.value;
    setLeisure(updatedLeisureInner);
  }

  const handleImageSelect = (e, index, section) => {
    if (e.target.checked) {
      // if (isSingle && thumbnailPreview !== "") {
      //   alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      setLeisure({ ...leisure, [section]: { ...leisure[section], section_avatar: imagesData[index].id } })
      // setThumbnailPreview(imagesData[index].avatar)
      setThumbnailPreview({...thumbnailPreview, [section]: imagesData[index].avatar })

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
      setLeisure({ ...leisure, [section]: { ...leisure[section], section_avatar: "" } })
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
    API.post(`/add_section`, leisure[name]).then(response => {
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
              <h4 className="mb-0">Add Leisure Activities</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
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
                          value={leisure.banner.section_name}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e, "banner")}
                          size="medium"
                          style={{ marginBottom: '1rem' }}
                      />

                      <div className="thumbnail-preview-wrapper-large img-thumbnail">
                        {
                          !leisure.banner.id > 0 ?
                              thumbnailPreview["banner"] !== "" ?
                                  <img src={thumbnailPreview["banner"]} alt={leisure.banner.section_avtar_alt || ""} />
                                  :
                                  <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                              :
                              typeof (leisure.banner.section_avatar) === typeof (0) ?
                                  // dining.thumbnail && dining.thumbnail !== "" ?
                                  <img src={thumbnailPreview["banner"]} alt={leisure.banner.section_avtar_alt || ""} />
                                  :
                                  <img src={leisure.banner.section_avatar} alt={leisure.banner.section_avtar_alt || ""} />
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
                      <MaterialButton onClick={() => handleSubmit(leisure.banner.id, "banner")} size="large" color="primary" variant="contained">
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
                  <Typography className={classes.heading}>Activities</Typography>
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
                          value={leisure.activities.section_name}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e, "activities")}
                          size="small"
                          style={{ marginBottom: '1rem' }}
                      />
                      {/* CKEDITOR  */}
                      {/*<CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />*/}
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.activities.id > 0 ?
                                  thumbnailPreview["activities"] !== "" ?
                                      <img src={thumbnailPreview["activities"]} alt={leisure.activities.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.activities.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["activities"]} alt={leisure.activities.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.activities.section_avatar} alt={leisure.activities.section_avtar_alt || ""} />
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
                                  setCurrentSection("activities");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.activities.id, "activities")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      {/* SECTION TITLE */}
                      <TextField
                          required
                          id="section_name"
                          name="section_name"
                          label="Section Title"
                          value={leisure.Fishing.section_name}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e, "Fishing")}
                          size="small"
                          style={{ marginBottom: '1rem' }}
                      />
                      {/* CKEDITOR  */}
                      {/*<CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />*/}
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.Fishing.id > 0 ?
                                  thumbnailPreview["Fishing"] !== "" ?
                                      <img src={thumbnailPreview["Fishing"]} alt={leisure.Fishing.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.Fishing.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["Fishing"]} alt={leisure.Fishing.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.Fishing.section_avatar} alt={leisure.Fishing.section_avtar_alt || ""} />
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
                                  setCurrentSection("Fishing");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.Fishing.id, "Fishing")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      {/* SECTION TITLE */}
                      <TextField
                          required
                          id="section_name"
                          name="section_name"
                          label="Section Title"
                          value={leisure.Unlock.section_name}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e, "Unlock")}
                          size="small"
                          style={{ marginBottom: '1rem' }}
                      />
                      {/* CKEDITOR  */}
                      {/*<CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />*/}
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.Unlock.id > 0 ?
                                  thumbnailPreview["Unlock"] !== "" ?
                                      <img src={thumbnailPreview["Unlock"]} alt={leisure.Unlock.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.Unlock.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["Unlock"]} alt={leisure.Unlock.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.Unlock.section_avatar} alt={leisure.Unlock.section_avtar_alt || ""} />
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
                                  setCurrentSection("Unlock");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.Unlock.id, "Fishing")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      {/* SECTION TITLE */}
                      <TextField
                          required
                          id="section_name"
                          name="section_name"
                          label="Section Title"
                          value={leisure.Water.section_name}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e, "Water")}
                          size="small"
                          style={{ marginBottom: '1rem' }}
                      />
                      {/* CKEDITOR  */}
                      {/*<CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisure.lounge.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, lounge: { ...leisureInner.lounge, section_content: e.editor.getData() } })} />*/}
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.Water.id > 0 ?
                                  thumbnailPreview["Water"] !== "" ?
                                      <img src={thumbnailPreview["Water"]} alt={leisure.Water.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.Water.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["Water"]} alt={leisure.Water.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.Water.section_avatar} alt={leisure.Water.section_avtar_alt || ""} />
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
                                  setCurrentSection("Water");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.Water.id, "Fishing")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
               {/********************/}
               {/*SECTION 2*/}
               {/********************/}
              <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                  <Typography className={classes.heading}>Awards And Certifications</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.awards.id > 0 ?
                                  thumbnailPreview["awards"] !== "" ?
                                      <img src={thumbnailPreview["awards"]} alt={leisure.awards.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.awards.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["awards"]} alt={leisure.awards.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.awards.section_avatar} alt={leisure.awards.section_avtar_alt || ""} />
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
                                  setCurrentSection("awards");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.awards.id, "awards")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={12}>
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
                              !leisure.excellence.id > 0 ?
                                  thumbnailPreview["excellence"] !== "" ?
                                      <img src={thumbnailPreview["excellence"]} alt={leisure.excellence.section_avtar_alt || ""} />
                                      :
                                      <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                                  :
                                  typeof (leisure.excellence.section_avatar) === typeof (0) ?
                                      // dining.thumbnail && dining.thumbnail !== "" ?
                                      <img src={thumbnailPreview["snorkeling"]} alt={leisure.excellence.section_avtar_alt || ""} />
                                      :
                                      <img src={leisure.excellence.section_avatar} alt={leisure.excellence.section_avtar_alt || ""} />
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
                                  setCurrentSection("excellence");
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
                      <MaterialButton onClick={() => handleSubmit(leisure.excellence.id, "excellence")} size="large" color="primary" variant="contained">
                        Update Section
                      </MaterialButton>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              {/*/!* ****************** *!/*/}
              {/*/!* SECTION 4 *!/*/}
              {/*/!* ****************** *!/*/}
              {/*<Accordion>*/}
              {/*  <AccordionSummary*/}
              {/*      expandIcon={<ExpandMoreIcon />}*/}
              {/*      aria-controls="panel4a-content"*/}
              {/*      id="panel4a-header"*/}
              {/*  >*/}
              {/*    <Typography className={classes.heading}>Discover the Marine Life</Typography>*/}
              {/*  </AccordionSummary>*/}
              {/*  <AccordionDetails>*/}
              {/*    <Grid container spacing={2}>*/}
              {/*      <Grid item xs={12} sm={9}>*/}
              {/*        /!* SECTION TITLE *!/*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="section_name"*/}
              {/*            name="section_name"*/}
              {/*            label="Section Title"*/}
              {/*            value={leisureInner.marine.section_name}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            onChange={(e) => handleInputChange(e, "marine")}*/}
              {/*            size="small"*/}
              {/*            style={{ marginBottom: '1rem' }}*/}
              {/*        />*/}
              {/*        /!* CKEDITOR  *!/*/}
              {/*        <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.marine.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, marine: { ...leisureInner.marine, section_content: e.editor.getData() } })} />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={3}>*/}
              {/*        /!* <TextField*/}
              {/*        required*/}
              {/*        id="section_avtar_alt"*/}
              {/*        name="section_avtar_alt"*/}
              {/*        label="Image Alt Text"*/}
              {/*        value={leisureInner.marine.section_avtar_alt}*/}
              {/*        variant="outlined"*/}
              {/*        fullWidth*/}
              {/*        onChange={(e) => handleInputChange(e, "marine")}*/}
              {/*        size="small"*/}
              {/*      /> *!/*/}
              {/*        <Card className={classes.root} style={{ marginTop: 0 }}>*/}
              {/*          <CardActionArea>*/}
              {/*            <div className="thumbnail-preview-wrapper-small img-thumbnail">*/}
              {/*              {*/}
              {/*                !leisureInner.marine.id > 0 ?*/}
              {/*                    thumbnailPreview["marine"] !== "" ?*/}
              {/*                        <img src={thumbnailPreview["marine"]} alt={leisureInner.marine.section_avtar_alt || ""} />*/}
              {/*                        :*/}
              {/*                        <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />*/}
              {/*                    :*/}
              {/*                    typeof (leisureInner.marine.section_avatar) === typeof (0) ?*/}
              {/*                        // dining.thumbnail && dining.thumbnail !== "" ?*/}
              {/*                        <img src={thumbnailPreview["marine"]} alt={leisureInner.marine.section_avtar_alt || ""} />*/}
              {/*                        :*/}
              {/*                        <img src={leisureInner.marine.section_avatar} alt={leisureInner.marine.section_avtar_alt || ""} />*/}
              {/*              }*/}
              {/*            </div>*/}
              {/*          </CardActionArea>*/}
              {/*          <CardActions>*/}
              {/*            <Fragment>*/}
              {/*              <MaterialButton*/}
              {/*                  variant="contained"*/}
              {/*                  color="primary"*/}
              {/*                  startIcon={<Image />}*/}
              {/*                  className="mt-1"*/}
              {/*                  fullWidth*/}
              {/*                  onClick={() => {*/}
              {/*                    setIsSingle(true);*/}
              {/*                    setCurrentSection("marine");*/}
              {/*                    setShowGallery(true);*/}
              {/*                  }}*/}
              {/*              >*/}
              {/*                Upload Featured Image*/}
              {/*              </MaterialButton>*/}
              {/*            </Fragment>*/}
              {/*          </CardActions>*/}
              {/*        </Card>*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <MaterialButton onClick={() => handleSubmit(leisureInner.marine.id, "marine")} size="large" color="primary" variant="contained">*/}
              {/*          Update Section*/}
              {/*        </MaterialButton>*/}
              {/*      </Grid>*/}
              {/*    </Grid>*/}
              {/*  </AccordionDetails>*/}
              {/*</Accordion>*/}



              {/*/!* ****************** *!/*/}
              {/*/!* SECTION 5 *!/*/}
              {/*/!* ****************** *!/*/}
              {/*<Accordion>*/}
              {/*  <AccordionSummary*/}
              {/*      expandIcon={<ExpandMoreIcon />}*/}
              {/*      aria-controls="panel5a-content"*/}
              {/*      id="panel5a-header"*/}
              {/*  >*/}
              {/*    <Typography className={classes.heading}>Others</Typography>*/}
              {/*  </AccordionSummary>*/}
              {/*  <AccordionDetails>*/}
              {/*    <Grid container spacing={2}>*/}
              {/*      <Grid item xs={12} sm={9}>*/}
              {/*        /!* SECTION TITLE *!/*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="section_name"*/}
              {/*            name="section_name"*/}
              {/*            label="Section Title"*/}
              {/*            value={leisureInner.others.section_name}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            onChange={(e) => handleInputChange(e, "others")}*/}
              {/*            size="small"*/}
              {/*            style={{ marginBottom: '1rem' }}*/}
              {/*        />*/}
              {/*        /!* CKEDITOR  *!/*/}
              {/*        <CKEditor onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={leisureInner.others.section_content} onChange={(e) => setLeisureInner({ ...leisureInner, others: { ...leisureInner.others, section_content: e.editor.getData() } })} />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={3}>*/}
              {/*        /!* <TextField*/}
              {/*        required*/}
              {/*        id="section_avtar_alt"*/}
              {/*        name="section_avtar_alt"*/}
              {/*        label="Image Alt Text"*/}
              {/*        value={leisureInner.others.section_avtar_alt}*/}
              {/*        variant="outlined"*/}
              {/*        fullWidth*/}
              {/*        onChange={(e) => handleInputChange(e, "others")}*/}
              {/*        size="small"*/}
              {/*      /> *!/*/}
              {/*        <Card className={classes.root} style={{ marginTop: 0 }}>*/}
              {/*          <CardActionArea>*/}
              {/*            <div className="thumbnail-preview-wrapper-small img-thumbnail">*/}
              {/*              {*/}
              {/*                !leisureInner.others.id > 0 ?*/}
              {/*                    thumbnailPreview["others"] !== "" ?*/}
              {/*                        <img src={thumbnailPreview["others"]} alt={leisureInner.others.section_avtar_alt || ""} />*/}
              {/*                        :*/}
              {/*                        <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />*/}
              {/*                    :*/}
              {/*                    typeof (leisureInner.others.section_avatar) === typeof (0) ?*/}
              {/*                        // dining.thumbnail && dining.thumbnail !== "" ?*/}
              {/*                        <img src={thumbnailPreview["others"]} alt={leisureInner.others.section_avtar_alt || ""} />*/}
              {/*                        :*/}
              {/*                        <img src={leisureInner.others.section_avatar} alt={leisureInner.others.section_avtar_alt || ""} />*/}
              {/*              }*/}
              {/*            </div>*/}
              {/*          </CardActionArea>*/}
              {/*          <CardActions>*/}
              {/*            <Fragment>*/}
              {/*              <MaterialButton*/}
              {/*                  variant="contained"*/}
              {/*                  color="primary"*/}
              {/*                  startIcon={<Image />}*/}
              {/*                  className="mt-1"*/}
              {/*                  fullWidth*/}
              {/*                  onClick={() => {*/}
              {/*                    setIsSingle(true);*/}
              {/*                    setCurrentSection("others");*/}
              {/*                    setShowGallery(true);*/}
              {/*                  }}*/}
              {/*              >*/}
              {/*                Upload Featured Image*/}
              {/*              </MaterialButton>*/}
              {/*            </Fragment>*/}
              {/*          </CardActions>*/}
              {/*        </Card>*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <MaterialButton onClick={() => handleSubmit(leisureInner.others.id, "others")} size="large" color="primary" variant="contained">*/}
              {/*          Update Section*/}
              {/*        </MaterialButton>*/}
              {/*      </Grid>*/}
              {/*    </Grid>*/}
              {/*  </AccordionDetails>*/}
              {/*</Accordion>*/}
              {/*<Accordion>*/}
              {/*  <AccordionSummary*/}
              {/*      expandIcon={<ExpandMoreIcon />}*/}
              {/*      aria-controls="panel2a-content"*/}
              {/*      id="panel2a-header"*/}
              {/*  >*/}
              {/*    <Typography className={classes.heading}>SEO Information</Typography>*/}
              {/*  </AccordionSummary>*/}
              {/*  <AccordionDetails>*/}
              {/*    <Grid container spacing={2}>*/}
              {/*      <Grid item xs={12} sm={6}>*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="meta_title"*/}
              {/*            name="meta_title"*/}
              {/*            label="Meta Title"*/}
              {/*            value={seoInfo.meta_title}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            onChange={handleSEOInputChange}*/}
              {/*            size="small"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={6}>*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="route"*/}
              {/*            name="route"*/}
              {/*            label="Permalink"*/}
              {/*            value={seoInfo.route}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            onChange={handleRouteChange}*/}
              {/*            size="small"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="meta_description"*/}
              {/*            name="meta_description"*/}
              {/*            label="Meta Description"*/}
              {/*            value={seoInfo.meta_description}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            onChange={handleSEOInputChange}*/}
              {/*            size="small"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <TextField*/}
              {/*            required*/}
              {/*            id="schema_markup"*/}
              {/*            name="schema_markup"*/}
              {/*            label="Schema Markup"*/}
              {/*            value={seoInfo.schema_markup}*/}
              {/*            variant="outlined"*/}
              {/*            fullWidth*/}
              {/*            multiline*/}
              {/*            rows={4}*/}
              {/*            rowsMax={4}*/}
              {/*            onChange={handleSEOInputChange}*/}
              {/*            size="small"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={6}>*/}
              {/*        <FormControl component="fieldset">*/}
              {/*          <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={seoInfo.is_followed} onChange={(e) => {*/}
              {/*            setSeoInfo({ ...seoInfo, is_followed: !seoInfo.is_followed })*/}
              {/*          }}>*/}
              {/*            <FormControlLabel value={true} control={<Radio />} label="Follow" />*/}
              {/*            <FormControlLabel value={false} control={<Radio />} label="No Follow" />*/}
              {/*          </RadioGroup>*/}
              {/*        </FormControl>*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={6}>*/}
              {/*        <FormControl component="fieldset">*/}
              {/*          <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={seoInfo.is_indexed} onChange={(e) => {*/}
              {/*            setSeoInfo({ ...seoInfo, is_indexed: !seoInfo.is_indexed })*/}
              {/*          }}>*/}
              {/*            <FormControlLabel value={true} control={<Radio />} label="Index" />*/}
              {/*            <FormControlLabel value={false} control={<Radio />} label="No Index" />*/}
              {/*          </RadioGroup>*/}
              {/*        </FormControl>*/}
              {/*      </Grid>*/}
              {/*      <Grid item xs={12} sm={12}>*/}
              {/*        <MaterialButton onClick={handleSEOSubmit} variant="contained" color="primary" size="large">*/}
              {/*          Update Section*/}
              {/*        </MaterialButton>*/}
              {/*      </Grid>*/}
              {/*    </Grid>*/}
              {/*  </AccordionDetails>*/}
              {/*</Accordion>*/}
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