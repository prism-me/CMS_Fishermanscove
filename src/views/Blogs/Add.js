import React, { Fragment, useEffect, useState } from "react"; //Suspense
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import MaterialButton from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, } from "@material-ui/core";
import CKEditor from "ckeditor4-react";
import { Image } from "@material-ui/icons";
import LangAPI from "langapi/http";

import { useParams, withRouter, useLocation } from "react-router-dom";
import GalleryDialog from "views/Common/GalleryDialog";

const website_url = "https://fishermanscove-resort.com/blog-inner/";
const append_url = "blog-inner";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));

export default withRouter(function AddRoom(props) {
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const lang = query.get('lang');
    const classes = useStyles();
    let { id } = useParams();

    const initialObject = {
        title: "",
        long_description: "",
        short_description: "",
        img: "",
        banner_img: "",
        sub_title: "",
        posted_by: "",
        author_img: "",
        author_details: "",
        slug: "",

        // meta_title: "",
        // meta_description: "",
        // schema_markup: "",
        // route: website_url,
        // inner_route: append_url,
        // is_followed: true,
        // is_indexed: true,
        // is_indexed_or_is_followed: "0,0",
    };
    const [room, setRoom] = useState({ ...initialObject });

    const [isEdit, setIsEdit] = useState(false);

    const [imagesData, setImagesData] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [isSingle, setIsSingle] = useState(false);
    const [isAuthorImg, setIsAuthorImg] = useState(false);
    const [selectedLang, setSelectedLang] = useState(lang || "en");
    const [authorthumbnailPreview, setAuthorThumbnailPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [isBanner, setIsBanner] = useState(false);
    const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");

    useEffect(() => {
        if (id && id != null) {
            setIsEdit(true);
            LangAPI.get(`/blogs/${id}?lang=${selectedLang}`).then((response) => {
                if (response.status === 200) {
                    let data = { ...response?.data?.data };
                    console.log("response?.data?.data", response?.data?.data)
                    // data.route = website_url + data.route;
                    if (response?.data?.data) {
                        setRoom({ ...room, ...data });
                    } else {
                        setRoom({ ...initialObject });
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
                setImagesData(response.data?.data?.map((x) => ({ ...x, isChecked: false })));
            }
        });
    };

    const handleInputChange = (e) => {
        let updatedRoom = { ...room };
        updatedRoom[e.target.name] = e.target.value;
        // if (e.target.name === "title" && !isEdit) {
        //     let updatedValue = e.target.value.replace(/\s+/g, "-");
        //     updatedValue = updatedValue.replace(/--/g, "-");
        //     updatedRoom["route"] = website_url + updatedValue.toLowerCase();
        // }
        setRoom(updatedRoom);
    };

    const handleSlugChange = (e) => {
        let updatedRoom = { ...room };
        let updatedValue = e.target.value.replace(/\s+/g, "-");
        updatedValue = updatedValue.replace(/--/g, "-");
        updatedRoom[e.target.name] = updatedValue.toLowerCase();
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
            if (isSingle && !isBanner && !isAuthorImg) {
                setRoom({ ...room, img: imagesData[index].avatar });
                setThumbnailPreview(imagesData[index].avatar);
                setTimeout(() => {
                    setShowGallery(false);
                }, 500);
            }
            else if (isBanner && !isSingle && !isAuthorImg) {
                setRoom({ ...room, banner_img: imagesData[index].avatar });
                setBannerThumbnailPreview(imagesData[index].avatar);
                setTimeout(() => {
                    setShowGallery(false);
                }, 500);
            }
            else if (isAuthorImg && !isSingle && !isBanner) {
                setRoom({ ...room, author_img: imagesData[index].avatar });
                setAuthorThumbnailPreview(imagesData[index].avatar);
                setTimeout(() => {
                    setShowGallery(false);
                }, 500);
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
            if (isSingle && !isBanner && !isAuthorImg) {
                setRoom({ ...room, img: "" });
                setThumbnailPreview("");
            }
            else if (isBanner && !isSingle && !isAuthorImg) {
                setRoom({ ...room, banner_img: "" });
                setBannerThumbnailPreview("");
            }
            else if (isAuthorImg && !isSingle && !isBanner) {
                setRoom({ ...room, author_img: "" });
                setAuthorThumbnailPreview("");
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
        // console.log("finalRoom",finalRoom) ;return false
        if (!finalRoom.title || finalRoom.title == "") {
            alert("Please Enter Name before Submiting")
            return false;
        }
        if (!finalRoom.posted_by || finalRoom.posted_by == "") {
            alert("Please Enter Writer Name before Submiting")
            return false;
        }
        if (!finalRoom.slug || finalRoom.slug == "") {
            alert("Please Enter Slug before Submiting")
            return false;
        }
        if (!finalRoom.img || finalRoom.img == "") {
            alert("Please Select Featured Image before Submiting")
            return false;
        }
        if (!finalRoom.banner_img || finalRoom.banner_img == "") {
            alert("Please Select Banner Image before Submiting")
            return false;
        }
        if (!finalRoom.short_description || finalRoom.short_description == "") {
            alert("Please Enter Short Description before Submiting")
            return false;
        }

        // finalRoom.route = finalRoom.route.split(website_url)?.[1];
        // finalRoom.inner_route = append_url;
        // finalRoom.is_indexed_or_is_followed = `${finalRoom.is_indexed ? "1" : "0"
        //     },${finalRoom.is_followed ? "1" : "0"}`;
        if (isEdit) {
            LangAPI.post(`/blogs?lang=${selectedLang}`, finalRoom).then((response) => {
                if (response.status === 200) {
                    alert("Blog Updated");
                    setRoom({ ...initialObject }); //clear all fields
                    props.history.push("/admin/blogs");
                }
            });
        } else {
            LangAPI.post(`/blogs?lang=${selectedLang}`, finalRoom).then((response) => {
                if (response.status === 200) {
                    alert("Blog Added");
                    setRoom({ ...initialObject });
                    props.history.push("/admin/blogs");
                }
            });
        }
    };

    const handleChange = (event) => {
        // setAge(event.target.value as string);
        if (event.target.value != selectedLang) {
            setSelectedLang(event.target.value)
        }
        console.log(event.target.value, "event.target.value")
    };
    return (
        <div className={classes.root}>
            <Card>
                <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
                    {/* <div className="d-flex justify-content-between align-items-center"> */}
                    <h4 style={{ fontWeight: "400" }} className="mb-0">
                        Add Blogs
                    </h4>
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
                            <MenuItem value={'ru'}>RU</MenuItem>

                        </Select>
                    </FormControl>
                    {/* </div> */}

                </CardHeader>
                <CardBody>
                    <h4 style={{ fontWeight: "400" }} className="mt-3">
                        General Information
                    </h4>
                    <Grid container spacing={2} style={{ display: "flex" }}>
                        <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="title"
                                        name="title"
                                        label="Name"
                                        value={room.title}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleInputChange}
                                        size="small"
                                        helperText={''}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="sub_title"
                                        name="sub_title"
                                        label="Sub_Title"
                                        value={room.sub_title}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleInputChange}
                                        size="small"
                                        helperText={''}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="posted_by"
                                        name="posted_by"
                                        label="Written By"
                                        value={room.posted_by}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleInputChange}
                                        size="small"
                                        helperText={''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="slug"
                                        name="slug"
                                        label="Slug"
                                        value={room.slug}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleSlugChange}
                                        size="small"
                                        helperText={''}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={9}>
                                    <h4 style={{ fontWeight: "400" }}>Writer Details</h4>

                                    <CKEditor
                                        onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                        data={room.author_details}
                                        onChange={(e) =>
                                            setRoom({ ...room, author_details: e.editor.getData() })
                                        }

                                    />
                                </Grid> */}
                                {/* <Grid item xs={12} sm={3}>
                                    <div className="thumbnail-preview-wrapper img-thumbnail mt-4">
                                        {!isEdit ? (
                                            authorthumbnailPreview && authorthumbnailPreview !== "" ? (
                                                <img src={authorthumbnailPreview} alt={room.alt_text || ""} />
                                            ) : (
                                                <img
                                                    src={require("./../../assets/img/placeholder.png")}
                                                    alt=""
                                                />
                                            )
                                        ) : typeof room.author_img === typeof 0 ? (
                                            // room.thumbnail && room.thumbnail !== "" ?
                                            <img src={authorthumbnailPreview} alt={room.alt_text || ""} />
                                        ) : (
                                            <img src={room.author_img} alt={room.alt_text || ""} />
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
                                                setIsAuthorImg(true);
                                                setIsBanner(false);
                                                setShowGallery(true);
                                            }}
                                        >
                                            {isEdit ? "Change" : "Upload"} Writer Image
                                        </MaterialButton>
                                    </Fragment>
                                </Grid> */}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <div className="thumbnail-preview-wrapper img-thumbnail">
                                        {!isEdit ? (
                                            thumbnailPreview && thumbnailPreview !== "" ? (
                                                <img src={thumbnailPreview} alt={room.alt_text || ""} />
                                            ) : (
                                                <img
                                                    src={require("./../../assets/img/placeholder.png")}
                                                    alt=""
                                                />
                                            )
                                        ) : typeof room.img === typeof 0 ? (
                                            // room.thumbnail && room.thumbnail !== "" ?
                                            <img src={thumbnailPreview} alt={room.alt_text || ""} />
                                        ) : (
                                            <img src={room.img} alt={room.alt_text || ""} />
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
                                                setIsAuthorImg(false);
                                                setIsBanner(false);
                                                setShowGallery(true);
                                            }}
                                        >
                                            {isEdit ? "Change" : "Upload"} Featured Image
                                        </MaterialButton>
                                    </Fragment>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                                setIsAuthorImg(false);
                                                setIsBanner(true);
                                                setShowGallery(true);
                                            }}
                                        >
                                            {isEdit ? "Change" : "Upload"} Banner Image
                                        </MaterialButton>
                                    </Fragment>
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
                                data={room.long_description}
                                onChange={(e) =>
                                    setRoom({ ...room, long_description: e.editor.getData() })
                                }
                            />
                        </Grid>
                        <div className="clearfix clear-fix"></div>
                        {/* GALLERY DIALOG BOX START */}

                        <GalleryDialog
                            open={showGallery} handleImageSelect={handleImageSelect} handleClose={() => {
                                setShowGallery(false);
                            }}
                            refreshGallery={getGalleryImages}
                            data={imagesData} />
                        {/* GALLERY DIALOG BOX END */}
                    </Grid>
                    <hr />

                    {/* <h4 style={{ fontWeight: "400" }} className="mt-2">
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
                            />
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
                    </Grid> */}
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
        </div>
    );
});
