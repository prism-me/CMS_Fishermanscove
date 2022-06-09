import React, { Fragment, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Image } from '@material-ui/icons';
import API from 'utils/http';
// import { Typography, Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Typography, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import LangAPI from "langapi/http";


import CKEditor from 'ckeditor4-react';
import { ckEditorConfig } from "utils/data";
export default function AddFAQDialog(props) {
    let { selectedLang, handleChange, page, handleChangePage, handleChangeInnerPage, innerpage, selectedFaq, section_content } = props
    const [id, set_id] = useState(-1);
    const [alt_tag, set_alt_tag] = useState("");
    const [avatar, set_avatar] = useState("");
    const [is360, set_is360] = useState(false);
    const [pageVal, setPageVal] = useState(section_content?.page || "");
    // const [selectedLang, setSelectedLang] = useState("en");

    useEffect(() => {

        if (props.image) {
            set_id(props.image?.id);
            set_alt_tag(props.image?.alt_tag);
            set_avatar(props.image?.avatar);
            set_is360(props.image?.["360_view"] === "1" ? true : false);
        }

    }, [props])


    const [diningData, setDiningData] = useState([]);

    const getDiningData = () => {
        LangAPI.get(`/dinings?lang=${selectedLang}`).then(response => {
            const allData = response.data?.data;
            setDiningData(allData);
        })
            .catch(err => {
                console.log(err)
            })
    }

    const [roomsData, setRoomsData] = useState([]);

    const getRoomsData = () => {
        LangAPI.get(`/rooms?lang=${selectedLang}`).then(response => {
            const allData = response.data?.data;
            setRoomsData(allData);
        })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getDiningData();
        getRoomsData();
    }, [selectedLang]);

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.currentFAQ?.post_name}</DialogTitle>
                <DialogContent>
                    <div className="mb-3 p-2" style={{ boxShadow: '0 0 4px #dadada', position: 'relative' }}>
                        <Typography className="mb-2 font-weight-bold" variant="body2">
                            ADD FAQ
                        </Typography>
                        <FormControl
                            variant="outlined"
                            size="small"
                            // style={{ color: "white" }}
                            fullWidth
                            style={{ marginBottom: '1rem' }}
                        >
                            <InputLabel id="language"
                            // style={{ color: "white" }}
                            >Select Language</InputLabel>
                            <Select
                                labelId="language"
                                id="language"
                                name="language"
                                value={selectedLang}
                                label="Select Language"
                                fullWidth
                                // style={{ color: "white" }}
                                onChange={handleChange}
                            >
                                <MenuItem value={'en'}>En</MenuItem>
                                <MenuItem value={'fr'}>FR</MenuItem>
                                <MenuItem value={'de'}>DE</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            size="small"
                            // style={{ color: "white" }}
                            fullWidth
                            style={{ marginBottom: '1rem' }}
                        >
                            <InputLabel id="language"
                            // style={{ color: "white" }}
                            >Select Page</InputLabel>
                            <Select
                                labelId="page"
                                id="page"
                                name="page"
                                value={section_content?.page}
                                label="Select page"
                                fullWidth
                                // style={{ color: "white" }}
                                // onChange={handleChangePage}
                                onChange={(e) => {
                                    handleChangePage(e)
                                    setPageVal(section_content?.page !== "" ? section_content?.page : e.target.value)
                                }}
                            >
                                <MenuItem value={'dining'}>Dining</MenuItem>
                                <MenuItem value={'rooms'}>Rooms</MenuItem>
                                <MenuItem value={'resort_activities'}>Other Resort Activities</MenuItem>
                                <MenuItem value={'faq'}>FAQ's</MenuItem>

                            </Select>
                        </FormControl>

                        {
                            pageVal === 'dining' &&
                            <FormControl
                                variant="outlined"
                                size="small"
                                // style={{ color: "white" }}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            >
                                <InputLabel id="language"
                                // style={{ color: "white" }}
                                >Select Inner Page</InputLabel>
                                <Select
                                    labelId="innerpage"
                                    id="innerpage"
                                    name="innerpage"
                                    value={section_content?.innerpage}
                                    label="Select Innner page"
                                    fullWidth
                                    // style={{ color: "white" }}
                                    style={{ marginBottom: '1rem' }}
                                    onChange={handleChangeInnerPage}
                                >
                                    {
                                        diningData?.map((x, i) => (
                                            <MenuItem value={x?.slug} key={i}>{x?.post_name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        }

                        {
                            pageVal === "rooms" &&
                            <FormControl
                                variant="outlined"
                                size="small"
                                // style={{ color: "white" }}
                                fullWidth
                                style={{ marginBottom: '1rem' }}
                            >
                                <InputLabel id="language"
                                // style={{ color: "white" }}
                                >Select Inner Page</InputLabel>
                                <Select
                                    labelId="innerpage"
                                    id="innerpage"
                                    name="innerpage"
                                    value={section_content?.innerpage}
                                    label="Select Innner page"
                                    fullWidth
                                    // style={{ color: "white" }}
                                    onChange={handleChangeInnerPage}
                                >
                                    {
                                        roomsData?.map((x, i) => (
                                            <MenuItem value={x?.slug} key={i}>{x?.post_name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        }

                        <TextField
                            required
                            id={`slug`}
                            name={`slug`}
                            label="Slug"
                            value={section_content?.slug}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => props.handleSlugChange(e)}
                            size="small"
                            style={{ marginBottom: '1rem' }}
                        />

                        <TextField
                            required
                            id={`question`}
                            name={`question`}
                            label="Question"
                            value={section_content?.question}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => props.handleQuestionChange(e)}
                            size="small"
                            style={{ marginBottom: '1rem' }}
                        />

                        {/* CKEDITOR  */}
                        <CKEditor
                            config={ckEditorConfig}
                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={section_content?.answer} onChange={(e) => props.handleAnswerChange(e.editor.getData())} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={props.handleSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}