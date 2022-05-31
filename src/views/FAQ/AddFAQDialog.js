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
    let { selectedLang, handleChange, page, handleChangePage} = props
    const [id, set_id] = useState(-1);
    const [alt_tag, set_alt_tag] = useState("");
    const [avatar, set_avatar] = useState("");
    const [is360, set_is360] = useState(false);
    // const [selectedLang, setSelectedLang] = useState("en");

    useEffect(() => {
        if (props.image) {
            set_id(props.image?.id);
            set_alt_tag(props.image?.alt_tag);
            set_avatar(props.image?.avatar);
            set_is360(props.image?.["360_view"] === "1" ? true : false);
        }
    }, [props.image])

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.currentFAQ?.post_name}</DialogTitle>
                <DialogContent>
                    <div className="mb-3 p-2" style={{ boxShadow: '0 0 4px #dadada', position: 'relative' }}>
                        <Typography className="mb-2 font-weight-bold" variant="body2">
                            Question
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
                                value={page}
                                label="Select page"
                                fullWidth
                                // style={{ color: "white" }}
                                onChange={handleChangePage}
                            >
                                <MenuItem value={'wedding'}>Wedding</MenuItem>
                                <MenuItem value={'dining'}>Dining</MenuItem>
                                <MenuItem value={'rooms'}>Rooms</MenuItem>
                                <MenuItem value={'gardens'}>Gardens</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <TextField
                            required
                            id={`question`}
                            name={`question`}
                            label="Section Title"
                            value={props.question}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => props.handleQuestionChange(e)}
                            size="small"
                            style={{ marginBottom: '1rem' }}
                        />
                        <TextField
                            required
                            id={`slug`}
                            name={`slug`}
                            label="Slug"
                            value={props.slug}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => props.handleSlugChange(e)}
                            size="small"
                            style={{ marginBottom: '1rem' }}
                        />
                        {/* CKEDITOR  */}
                        <CKEditor
                            config={ckEditorConfig}
                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)} data={props.answer} onChange={(e) => props.handleAnswerChange(e.editor.getData())} />
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