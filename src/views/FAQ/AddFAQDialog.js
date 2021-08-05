import React, { Fragment, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Image } from '@material-ui/icons';
import API from 'utils/http';
import { Typography, Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import CKEditor from 'ckeditor4-react';
import { ckEditorConfig } from "utils/data";
export default function AddFAQDialog(props) {
    const [id, set_id] = React.useState(-1);
    const [alt_tag, set_alt_tag] = React.useState("");
    const [avatar, set_avatar] = React.useState("");
    const [is360, set_is360] = React.useState(false);

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