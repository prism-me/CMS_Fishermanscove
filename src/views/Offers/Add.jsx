import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MaterialButton from "@material-ui/core/Button";

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import {
  MenuItem,
  Select,
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Avatar,
} from "@material-ui/core";
import CKEditor from "ckeditor4-react";

import { ckEditorConfig } from "utils/data";

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { DeleteOutlined, Image } from "@material-ui/icons";
import API from "utils/http";
import { useParams } from "react-router-dom";
import GalleryDialog from "views/Common/GalleryDialog";
import SelectedImagesThumbnails from "../Common/SelectedImagesThumbnails";

const website_url = "https://fishermanscove-resort.com/offers/";
const append_url = "offers/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function AddOffer(props) {
  const classes = useStyles();
  //check if edit or add request
  let { id } = useParams();

  const initialObject = {
    post_name: "",
    post_content: "<p>Detailed content goes here!</p>",
    short_description: "<p>Short description goes here!</p>",
    room_type: -1,
    thumbnail: "",
    banner_img: "",
    banner_text: "",
    alt_text: "",
    meta_title: "",
    meta_description: "",
    schema_markup: "",
    post_url: "",
    route: website_url,
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: "1,1",
    img_directory: "offers",
    images_list: [],
    category_id: 5,
  };
  const [offer, setOffer] = useState({ ...initialObject });
  const [offerImages, setOfferImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [post_id, setPostId] = useState(-1);

  const [imagesData, setImagesData] = useState([]);
  const [uploadsPreview, setUploadsPreview] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [renderPreviews, setRenderPreviews] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");

  useEffect(() => {
    if (id && id != null) {
      setIsEdit(true);
      setPostId(id);
      API.get(`/offers/${id}/edit`).then((response) => {
        if (response.status === 200) {
          let data = { ...response?.data?.category_details[0] };
          data.route = website_url + data.route;
          setOffer({ ...offer, ...data });
          setUploadsPreview(response.data?.uploads);
        }
      });
    }
    API.get("/offer_categories/offers").then((response) => {
      if (response?.status === 200) {
        setCategories(response.data);
      }
    });
    getGalleryImages();
  }, []);

  const getGalleryImages = () => {
    API.get(`/uploads`).then((response) => {
      if (response.status === 200) {
        setImagesData(response.data?.map((x) => ({ ...x, isChecked: false })));
      }
    });
  };

  const handleInputChange = (e) => {
    let updatedOffer = { ...offer };
    updatedOffer[e.target.name] = e.target.value;
    if (e.target.name === "post_name" && !isEdit) {
      let updatedValue = e.target.value.replace(/\s+/g, "-");
      updatedValue = updatedValue.replace(/--/g, "-");
      updatedOffer["route"] = website_url + updatedValue.toLowerCase();
    }
    setOffer(updatedOffer);
  };

  const handleRouteChange = (e) => {
    // eslint-disable-next-line no-debugger
    // debugger;
    let updatedOffer = { ...offer };
    let splitValues = e.target.value.split(website_url);
    let updatedValue = splitValues[1]
      ? splitValues[1].replace(/\s+/g, "-")
      : "";
    updatedValue = updatedValue.replace(/--/g, "-");
    updatedOffer[e.target.name] = website_url + updatedValue.toLowerCase();
    setOffer(updatedOffer);
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      // if (isSingle && !isBanner) {
      // alert("You can only select 1 image for thubnail. If you want to change image, deselect the image and then select a new one");
      //   setShowGallery(false);
      //   return;
      // } else if (!isSingle && isBanner ) {
      //   alert("You can only select 1 image for banner. If you want to change image, deselect the image and then select a new one");
      //   return;
      // } else {
      if (isSingle && !isBanner) {
        setOffer({ ...offer, thumbnail: imagesData[index].id });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setOffer({ ...offer, banner_img: imagesData[index].id });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setShowGallery(false);
        }, 500);
      } else {
        setSelectedImages([...selectedImages, imagesData[index].id]);
      }
      let imagesDataUpdated = imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: true,
          };
        } else {
          return x;
        }
      });
      setImagesData(imagesDataUpdated);
      // }
    } else {
      if (isSingle && !isBanner) {
        setOffer({ ...offer, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setOffer({ ...offer, banner_img: "" });
        setBannerThumbnailPreview("");
      } else {
        setSelectedImages(
          selectedImages.filter((x) => x !== imagesData[index].id)
        );
      }
      setImagesData(
        imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: false,
            };
          } else {
            return x;
          }
        })
      );
    }
  };

  const handleSubmit = () => {
    let finalOffer = offer;
    finalOffer.route = finalOffer.route.split(website_url)?.[1];

    // finalOffer.images_list = JSON.stringify(selectedImages);

    finalOffer.is_indexed_or_is_followed = `${finalOffer.is_indexed},${finalOffer.is_followed}`;

    if (isEdit) {
      finalOffer.images_list = [
        ...JSON.parse(finalOffer.images_list),
        ...selectedImages,
      ];
      finalOffer.images_list = JSON.stringify(finalOffer.images_list);

      API.put(`/offers/${id}`, finalOffer)
        .then((response) => {
          if (response.status === 200) {
            alert("Record Updated");
            // setOffer({ ...initialObject }); //resetting the form
            // eslint-disable-next-line react/prop-types
            props.history.push("/admin/offers");
          }
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      finalOffer.images_list = JSON.stringify(selectedImages);

      API.post("/offers", finalOffer)
        .then((response) => {
          if (response.status === 200) {
            alert("Record Added");
            setPostId(response.data?.post_id);
            // setOffer({ ...initialObject });
            props.history.push("/admin/offers");
          }
        })
        .catch((err) => alert("Something went wrong."));
    }
  };

  const handleRemoveSelectedImage = (x, arrayListType) => {
    switch (arrayListType) {
      case "uploadsPreview" :
        let updatePreview = uploadsPreview.filter((u) => u.id !== x.id)
        setUploadsPreview(updatePreview);
        setImagesData(imagesData.map(im => {
          if(im.id === x.id)
          {
            im.isChecked = false
          }
          return im
        }))
        setSelectedImages(updatePreview.map((u) => u.id ));
        break;
      case "selectedImages" :
        let updateData = selectedImages.filter((u) => u !== x.id);
        setImagesData(imagesData.map(im => {
          if(im.id === x.id)
          {
            im.isChecked = false
          }
          return im
        }))
        setSelectedImages(updateData);
        break;
      default :
        return setUploadsPreview(uploadsPreview.filter((u) => u.id !== x.id))
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 style={{ fontWeight: "400" }} className="mb-0">
              Add an Offer
            </h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
          </CardHeader>
          <CardBody>
            <h4 style={{ fontWeight: "400" }} className="mt-1">
              General Information
            </h4>
            <Grid container spacing={2} style={{ display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="post_name"
                      name="post_name"
                      label="Name"
                      value={offer.post_name}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      fullWidth
                      className={classes.formControl}
                    >
                    
                      <TextField
                        required
                        id="post_url"
                        name="post_url"
                        label="synxis Link"
                        value={offer.post_url}
                        variant="outlined"
                        fullWidth
                        onChange={handleInputChange}
                        size="small"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <div className="thumbnail-preview-wrapper-small img-thumbnail">
                      {!isEdit ? (
                        thumbnailPreview && thumbnailPreview !== "" ? (
                          <img
                            src={thumbnailPreview}
                            alt={offer.alt_text || ""}
                          />
                        ) : (
                          <img
                            src={require("./../../assets/img/placeholder.png")}
                            alt=""
                          />
                        )
                      ) : typeof offer.thumbnail === typeof 0 ? (
                        // offer.thumbnail && offer.thumbnail !== "" ?
                        <img
                          src={thumbnailPreview}
                          alt={offer.alt_text || ""}
                        />
                      ) : (
                        <img src={offer.thumbnail} alt={offer.alt_text || ""} />
                      )}
                    </div>
                    <Fragment>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        startIcon={<Image />}
                        className="mt-1"
                        fullWidth
                        onClick={() => {
                          setIsSingle(true);
                          setIsBanner(false);
                          setShowGallery(true);
                        }}
                      >
                        {isEdit ? "Change" : "Upload"} Featured Image
                      </MaterialButton>
                    </Fragment>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="banner_text"
                      name="banner_text"
                      label="Banner Text"
                      value={offer.banner_text}
                      variant="outlined"
                      fullWidth
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={12}>
                    <div className="thumbnail-preview-wrapper img-thumbnail">
                      {!isEdit ? (
                        bannerThumbnailPreview &&
                        bannerThumbnailPreview !== "" ? (
                          <img
                            src={bannerThumbnailPreview}
                            alt={offer.alt_text || ""}
                          />
                        ) : (
                          <img
                            src={require("./../../assets/img/placeholder.png")}
                            alt=""
                          />
                        )
                      ) : typeof offer.banner_img === typeof 0 ? (
                        // offer.thumbnail && offer.thumbnail !== "" ?
                        <img
                          src={bannerThumbnailPreview}
                          alt={offer.alt_text || ""}
                        />
                      ) : (
                        <img
                          src={offer.banner_img}
                          alt={offer.alt_text || ""}
                        />
                      )}
                    </div>
                    <Fragment>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        startIcon={<Image />}
                        className="mt-1"
                        fullWidth
                        onClick={() => {
                          setIsSingle(false);
                          setIsBanner(true);
                          setShowGallery(true);
                        }}
                      >
                        {isEdit ? "Change" : "Upload"} Featured Image
                      </MaterialButton>
                    </Fragment>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }}>Short Description</h4>
                <CKEditor
                    config={ckEditorConfig}
                    onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={offer.short_description}
                  onChange={(e) =>
                    setOffer({
                      ...offer,
                      short_description: e.editor.getData(),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <hr />
                <h4 style={{ fontWeight: "400" }}>Detailed Content</h4>
                <CKEditor
                    config={ckEditorConfig}
                    onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={offer.post_content}
                  onChange={(e) =>
                    setOffer({ ...offer, post_content: e.editor.getData() })
                  }
                />
              </Grid>
            </Grid>
            <hr />
            <h4 style={{ fontWeight: "400" }} className="mt-2">
              SEO Information
            </h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="meta_title"
                  name="meta_title"
                  label="Meta Title"
                  value={offer.meta_title}
                  variant="outlined"
                  fullWidth
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="route"
                  name="route"
                  label="Permalink"
                  value={offer.route}
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
                  value={offer.meta_description}
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
                  value={offer.schema_markup}
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
                  <RadioGroup
                    aria-label="is_followed"
                    row
                    defaultChecked
                    name="is_followed"
                    value={offer.is_followed}
                    onChange={(e) => {
                      setOffer({ ...offer, is_followed: !offer.is_followed });
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Follow"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No Follow"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="is_indexed"
                    row
                    defaultChecked
                    name="is_indexed"
                    value={offer.is_indexed}
                    onChange={(e) => {
                      setOffer({ ...offer, is_indexed: !offer.is_indexed });
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Index"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No Index"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardBody>
        </Card>

        {/* MULTIPLE IMAGES UPLOAD SECTION START */}
        <Card>
          <CardBody>
            <h3>Offer Images</h3>
            <p>
              <em>Please select images from gallery.</em>
            </p>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <MaterialButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setRenderPreviews(false);
                    setIsSingle(false);
                    setIsBanner(false);
                    setShowGallery(true);
                  }}
                >
                  Select Gallery Images
                </MaterialButton>
              </Grid>
              {renderPreviews &&
                imagesData
                  ?.filter(function (array_el) {
                    return (
                      selectedImages.filter(function (menuItems_el) {
                        return menuItems_el == array_el.id;
                      }).length !== 0
                    );
                  })
                  ?.map((x) => (
                      <SelectedImagesThumbnails x={x}
                                                handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "selectedImages")}/>
                    // <Grid item xs={12} sm={2}>
                    //   <div style={{ height: "120px" }}>
                    //     <img
                    //       width="100%"
                    //       src={x.avatar}
                    //       className="img-thumbnail"
                    //       alt=""
                    //       style={{ height: "90%", objectFit: "cover" }}
                    //     />
                    //     <p style={{ fontSize: "12px" }} className="text-center">
                    //       {x.alt_tag}
                    //     </p>
                    //   </div>
                    // </Grid>
                  ))}
              {uploadsPreview &&
                uploadsPreview?.map((x) => (
                    <SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r)=>handleRemoveSelectedImage(r,"uploadsPreview")}/>
                  // <Grid item xs={12} sm={2}>
                  //   <div style={{ height: "120px" }}>
                  //     <img
                  //       width="100%"
                  //       src={x.avatar}
                  //       className="img-thumbnail"
                  //       alt=""
                  //       style={{ height: "90%", objectFit: "cover" }}
                  //     />
                  //     <p style={{ fontSize: "12px" }} className="text-center">
                  //       {x.alt_tag}
                  //     </p>
                  //   </div>
                  // </Grid>
                ))}
              <div className="clearfix clear-fix"></div>
              {/* GALLERY DIALOG BOX START */}
              <GalleryDialog
                isSingle={isSingle}
                open={showGallery}
                handleImageSelect={handleImageSelect}
                handleClose={() => {
                  setShowGallery(false);
                  setRenderPreviews(true);
                  setUploadsPreview([])
                }}
                refreshGallery={getGalleryImages}
                data={imagesData}
                selectedData={selectedImages}
              />
              {/* GALLERY DIALOG BOX END */}
            </Grid>
          </CardBody>
        </Card>
        {/* MULTIPLE IMAGES UPLOAD SECTION END */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <MaterialButton
              onClick={handleSubmit}
              style={{ float: "right" }}
              variant="contained"
              color="primary"
              size="large"
            >
              Submit
            </MaterialButton>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
