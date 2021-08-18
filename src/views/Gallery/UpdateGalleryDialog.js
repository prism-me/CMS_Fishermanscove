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
import { Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

export default function UpdateGalleryDialog(props) {
    console.log(props.image)
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

    const handleFileChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        set_avatar(files[0]);
    }

    const handleSubmit = () => {
        let imagesFormData = new FormData();
        imagesFormData.append("images[]", avatar);
        imagesFormData.append("id", id);
        imagesFormData.append("data[]", JSON.stringify({
            alt_tag,
            is360
        }));
        // props.onClose();
        // return;
        API.post(`/upload_edit`, imagesFormData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
            }
        }).then(response => {
            if (response.status === 200) {
                alert("Image updated successfully.");
                // this.setState({currentFiles: []})
            }
        }).catch(err => alert("Something went wrong"));

    }

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Gallery Image</DialogTitle>
                <DialogContent>
                    <form type="post" encType="multipart/form-data">

                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="alt_tag"
                                    label="Alternate Text"
                                    type="text"
                                    fullWidth
                                    size="small"
                                    value={alt_tag}
                                    onChange={(e) => set_alt_tag(e.target.value)}
                                    variant="outlined"
                                />
                                <FormControl style={{ marginTop: '1rem' }} component="fieldset">
                                    <RadioGroup aria-label="is360" row defaultChecked name="is360" value={is360} onChange={(e) => { }}>
                                        <FormControlLabel value={false} control={<Radio />} label="Regular/Slider" />
                                        <FormControlLabel value={true} control={<Radio />} label={<span>360<sup>o</sup> View</span>} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div style={{
                                    width: '100%', height: '180px'
                                }}>
                                    <img width="100%" style={{ height: '100%', objectFit: 'cover' }} className="img-thumbnail" src={typeof (avatar) === typeof ("") ? avatar : URL.createObjectURL(avatar)} alt="" />
                                </div>
                                <Fragment>
                                    <input
                                        color="primary"
                                        accept="image/*"
                                        type="file"
                                        onChange={handleFileChange}
                                        fullWidth
                                        id="thumbnail"
                                        name="thumbnail"
                                        style={{ display: 'none', width: '100%' }}
                                    />
                                    <label htmlFor="thumbnail" style={{ width: '100%', margin: 0, marginTop: '.5rem' }}>
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            // size="sm"
                                            fullWidth
                                            disableElevation={true}
                                            color="primary"
                                            style={{ margin: 0, width: '100%' }}
                                        >
                                            <Image /> Upload Featured Image
                                    </Button>
                                    </label>
                                </Fragment>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} variant="contained" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Submit
                     </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}