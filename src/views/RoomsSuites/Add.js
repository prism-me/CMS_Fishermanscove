import React, { Fragment, useEffect, useState } from "react"; //Suspense
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
// import Paper from '@material-ui/core/Paper';
import MaterialButton from "@material-ui/core/Button";

// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";

// import avatar from "assets/img/faces/marc.jpg";
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, } from "@material-ui/core";
import LangAPI from "langapi/http";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "utils/data";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
// import ClassicEditor from "../../plugins/ckeditor.js";
// import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import { Image } from "@material-ui/icons";
import { useParams, withRouter, useLocation } from "react-router-dom";

// ClassicEditor.b
// import FormGroup from '@material-ui/core/FormGroup';
// import Checkbox from '@material-ui/core/Checkbox';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import Favorite from '@material-ui/icons/Favorite';
// import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import GalleryDialog from "views/Common/GalleryDialog";
import SelectedImagesThumbnails from "../Common/SelectedImagesThumbnails";

const website_url = "https://fishermanscove-resort.com/rooms/";
const append_url = "rooms-inner";

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

export default withRouter(function AddRoom(props) {
    const classes = useStyles();
    //check if edit or add request
    let { id } = useParams();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const lang = query.get('lang');

    const initialObject = {
        post_name: "",
        post_content: "",
        short_description: "",
        room_type: -1,
        slug: "",
        parent_id: -1,
        thumbnail: "",
        banner_img: "",
        banner_text: "",
        alt_text: "",
        meta_title: "",
        meta_description: "",
        schema_markup: "",
        post_url: "",
        route: website_url,
        inner_route: append_url,
        is_followed: true,
        is_indexed: true,
        is_indexed_or_is_followed: "0,0",
        images_list: [],
    };
    const [room, setRoom] = useState({ ...initialObject });

    const [roomImages, setRoomImages] = useState([]);
    const [maskedRoute, setMaskedRoute] = useState(website_url);
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
    const [isImagesList, setImagesList] = useState(false);
    const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
    const [selectedLang, setSelectedLang] = useState(lang || "en");


    useEffect(() => {
        if (id && id != null) {
            setIsEdit(true);
            // setPostId(id);
            LangAPI.get(`/rooms/${id}?lang=${selectedLang}`).then((response) => {
                if (response.status === 200) {

                    let data = { ...response?.data?.data };
                    data.route = website_url + data.route;
                    if (response?.data?.data) {
                        setRoom({ ...room, ...data });
                        // setUploadsPreview(response.data?.uploads);
                        let images = []
                        if (response?.data?.data.images_list) {
                            images = JSON.parse(response?.data?.data.images_list)
                        }
                        setSelectedImages(images)
                        setThumbnailPreview(response?.data?.data?.thumbnailPreview)
                        setBannerThumbnailPreview(response?.data?.data?.banner_imgPreview)
                    } else {
                        setRoom(initialObject);
                        setUploadsPreview(false);
                        setSelectedImages([])
                    }
                }
            });
        }

        if (!imagesData.length > 0) {
            getGalleryImages();
        }
    }, [selectedLang]);

    const getGalleryImages = () => {
        LangAPI.get(`/get_all_images`).then((response) => {
            if (response.status === 200) {
                setImagesData(response.data.data);
            }
        });
    };

    const handleInputChange = (e) => {
        let updatedRoom = { ...room };
        updatedRoom[e.target.name] = e.target.value;
        if (e.target.name === "post_name" && !isEdit) {
            let updatedValue = e.target.value.replace(/\s+/g, "-");
            updatedValue = updatedValue.replace(/--/g, "-");
            updatedRoom["route"] = website_url + updatedValue.toLowerCase();
        }
        setRoom(updatedRoom);
    };

    const handleRouteChange = (e) => {
        let updatedRoom = { ...room };
        let splitValues = e.target.value.split(website_url);
        let updatedValue = splitValues[1]
            ? splitValues[1].replace(/\s+/g, "-")
            : "";
        updatedValue = updatedValue.replace(/--/g, "-");
        updatedRoom[e.target.name] = website_url + updatedValue.toLowerCase();
        setRoom(updatedRoom);
    };

    const handleImageSelect = (e, index) => {
        if (e.target.checked) {
            if (isSingle && !isBanner && !isImagesList) {

                setRoom({ ...room, thumbnail: imagesData[index].avatar, thumbnailPreview: imagesData[index].avatar });
                setThumbnailPreview(imagesData[index].avatar);

                setTimeout(() => {
                    setShowGallery(false);
                }, 500);

            } else if (!isSingle && isBanner && !isImagesList) {

                setRoom({ ...room, banner_img: imagesData[index].avatar, banner_imgPreview: imagesData[index].avatar });
                setBannerThumbnailPreview(imagesData[index].avatar);
                setTimeout(() => {
                    setShowGallery(false);
                }, 500);

            } else if (!isSingle && !isBanner && isImagesList) {

                setSelectedImages([...selectedImages, imagesData[index]]);
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
            }

            // }
        } else {
            if (isSingle && !isBanner) {
                setRoom({ ...room, thumbnail: "" });
                setThumbnailPreview("");
            } else if (!isSingle && isBanner) {
                setRoom({ ...room, banner_img: "" });
                setBannerThumbnailPreview("");
            } else {
                setSelectedImages(
                    selectedImages.filter((x) => x !== imagesData[index]._id)
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
        let finalRoom = room;
        finalRoom.route = finalRoom?.route?.split(website_url)?.[1];
        finalRoom.inner_route = append_url;
        finalRoom.images_list = JSON.stringify(selectedImages);
        finalRoom.is_indexed_or_is_followed = `${finalRoom.is_indexed ? "1" : "0"},${finalRoom.is_followed ? "1" : "0"}`;

        if (!finalRoom.post_name || finalRoom.post_name == "") {
            alert("Please Add Room/Suite Name");
            return false;
        }
        if (!finalRoom.banner_text || finalRoom.banner_text == "") {
            alert("Please Add Banner Text");
            return false;
        }
        if (!finalRoom.thumbnailPreview || finalRoom.thumbnailPreview == "") {
            alert("Please Select Featured Image");
            return false;
        }
        if (!finalRoom.banner_imgPreview || finalRoom.banner_imgPreview == "") {
            alert("Please Select Banner Image");
            return false;
        }
        if (!finalRoom.room_type || finalRoom.room_type == "") {
            alert("Please Select Room/Suite Type");
            return false;
        }
        if (!finalRoom.slug || finalRoom.slug == "") {
            alert("Please Select Slug for The Room/Suite");
            return false;
        }
        if (!finalRoom.post_url || finalRoom.post_url == "") {
            alert("Please Select Synesis Link");
            return false;
        }
        if (!finalRoom.short_description || finalRoom.short_description == "") {
            alert("Please Add Short Description");
            return false;
        }
        if (!finalRoom.post_content || finalRoom.post_content == "") {
            alert("Please Add Detailed Content");
            return false;
        }
        if (!selectedImages.length > 0) {
            alert("Please Select Room Images");
            return false;
        }

        if (isEdit) {
            LangAPI.post(`/rooms?lang=${selectedLang}`, finalRoom).then((response) => {
                if (response.status === 200) {
                    alert("Record Updated");
                    setRoom({ ...initialObject }); //clear all fields
                    props.history.push("/admin/room-suites");
                }
            });
        } else {
            LangAPI.post(`/rooms?lang=${selectedLang}`, finalRoom).then((response) => {
                if (response.status === 200) {
                    setPostId(response.data?.post_id);
                    alert("Record Updated");
                    setRoom({ ...initialObject });
                    props.history.push("/admin/room-suites");
                }
            });
        }
    };

    const handleRemoveSelectedImage = (x, arrayListType) => {
        switch (arrayListType) {
            case "uploadsPreview":
                let updatePreview = uploadsPreview.filter((u) => u._id !== x._id)
                setUploadsPreview(updatePreview);
                setImagesData(imagesData.map(im => {
                    if (im._id === x._id) {
                        im.isChecked = false
                    }
                    return im
                }))
                setSelectedImages(updatePreview.map((u) => u._id));
                break;
            case "selectedImages":
                let updateData = selectedImages.filter((u) => u._id !== x._id);
                setImagesData(imagesData.map(im => {
                    if (im._id === x._id) {
                        im.isChecked = false
                    }
                    return im
                }))
                setSelectedImages(updateData);
                break;
            default:
                return setUploadsPreview(uploadsPreview.filter((u) => u._id !== x._id))
        }
    }

    const handleChange = (event) => {
        // setAge(event.target.value as string);
        if (event.target.value != selectedLang) {
            setSelectedLang(event.target.value)
        }
    };

    return (
        <div className={classes.root}>
            <Card>
                <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
                    {/* <h4 style={{ fontWeight: "400" }} className="mb-0">
                        Add Room/Suite
                    </h4> */}
                    <h4 className="mb-0">Add Room/Suite</h4>
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
                    {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
                </CardHeader>
                <CardBody>
                    <h4 style={{ fontWeight: "400" }} className="mt-3">
                        General Information
                    </h4>
                    <Grid container spacing={2} style={{ display: "flex" }}>
                        <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={12}>
                                    <div className="thumbnail-preview-wrapper img-thumbnail">
                                        {!isEdit ? (
                                            thumbnailPreview && thumbnailPreview !== "" ? (
                                                <img src={thumbnailPreview} alt={room.alt_tag || ""} />
                                            ) : (
                                                <img
                                                    src={require("./../../assets/img/placeholder.png")}
                                                    alt=""
                                                />
                                            )
                                        ) : typeof room.thumbnail === typeof 0 ? (
                                            // room.thumbnail && room.thumbnail !== "" ?
                                            <img src={thumbnailPreview} alt={room.alt_tag || ""} />
                                        ) : (
                                            <img src={room.thumbnail} alt={room.alt_tag || ""} />
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
                                                setImagesList(false);
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
                                        value={room.banner_text}
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
                                                    alt={room.alt_text || ""}
                                                />
                                            ) : (
                                                <img
                                                    src={require("./../../assets/img/placeholder.png")}
                                                    alt=""
                                                />
                                            )
                                        ) : typeof room.banner_img === typeof 0 ? (
                                            // room.thumbnail && room.thumbnail !== "" ?
                                            <img
                                                src={bannerThumbnailPreview}
                                                alt={room.alt_text || ""}
                                            />
                                        ) : (
                                            <img src={room.banner_img} alt={room.alt_text || ""} />
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
                                                setImagesList(false);
                                            }}
                                        >
                                            {isEdit ? "Change" : "Upload"} Banner Image
                                        </MaterialButton>
                                    </Fragment>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        className={classes.formControl}
                                    >
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
                                    <TextField
                                        required
                                        id="slug"
                                        name="slug"
                                        label="Slug"
                                        value={room.slug}
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
                                        label="Synesis Link"
                                        value={room.post_url}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <hr />
                            <h4 style={{ fontWeight: "400" }}>Short Description</h4>
                            <CKEditor
                                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                data={room.short_description}
                                onChange={(e) =>
                                    setRoom({ ...room, short_description: e.editor.getData() })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <hr />
                            <h4 style={{ fontWeight: "400" }}>Detailed Content</h4>

                            <CKEditor
                                onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                data={room.post_content}
                                onChange={(e) =>
                                    setRoom({ ...room, post_content: e.editor.getData() })
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
                                value={room.meta_title}
                                variant="outlined"
                                fullWidth
                                onChange={handleInputChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {
                                isEdit ?
                                    <TextField
                                        required
                                        id="route"
                                        name="route"
                                        label="Permalink"
                                        value={room.route}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleRouteChange}
                                        size="small"
                                        InputProps={{
                                            disabled: true,
                                        }}
                                    /> :
                                    <TextField
                                        required
                                        id="route"
                                        name="route"
                                        label="Permalink"
                                        value={room.route}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleRouteChange}
                                        size="small"
                                        InputProps={{
                                            disabled: false,
                                        }}
                                    />
                            }
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
                                <RadioGroup
                                    aria-label="is_followed"
                                    row
                                    defaultChecked
                                    name="is_followed"
                                    value={room.is_followed}
                                    onChange={(e) => {
                                        setRoom({ ...room, is_followed: !room.is_followed });
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
                                    value={room.is_indexed}
                                    onChange={(e) => {
                                        setRoom({ ...room, is_indexed: !room.is_indexed });
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
                        {/* <Grid item xs={12} sm={12}>
              <MaterialButton onClick={handleSubmit} style={{ float: 'right' }} variant="contained" color="primary" size="large">
                Submit
              </MaterialButton>
            </Grid> */}
                    </Grid>
                </CardBody>
            </Card>
            {/* {isEdit && */}
            <Card>
                <CardBody>
                    <h3>Room Images</h3>
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
                                    setImagesList(true);
                                    setIsSingle(false);
                                    setIsBanner(false);
                                    setShowGallery(true);
                                }}
                            >
                                Select Gallery Images
                            </MaterialButton>
                        </Grid>
                        {imagesData
                            ?.filter(function (array_el) {
                                return (
                                    selectedImages.filter(function (menuItems_el) {
                                        return menuItems_el._id === array_el._id;
                                    }).length !== 0
                                );
                            })
                            ?.map((x) => (
                                <SelectedImagesThumbnails
                                    x={x}
                                    handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "selectedImages")} />
                                // <Grid item xs={12} sm={2}>
                                //     <div style={{height: "120px"}}>
                                //         <div className="d-flex position-absolute" style={{cursor: "pointer"}}>
                                //             <CancelIcon/>
                                //         </div>
                                //         <img
                                //             width="100%"
                                //             src={x.avatar}
                                //             className="img-thumbnail position-relative"
                                //             alt=""
                                //             style={{height: "90%", objectFit: "cover"}}
                                //         />
                                //         <p style={{fontSize: "12px"}} className="text-center">
                                //             {x.alt_tag}
                                //         </p>
                                //     </div>
                                // </Grid>
                            ))}
                        {uploadsPreview &&
                            uploadsPreview?.map((x) => (
                                <SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "uploadsPreview")} />
                            ))}
                        <div className="clearfix clear-fix"></div>
                        {/* GALLERY DIALOG BOX START */}
                        <GalleryDialog
                            isSingle={isSingle}
                            isBanner={isBanner}
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
            {/* } */}
        </div>
    );
});
