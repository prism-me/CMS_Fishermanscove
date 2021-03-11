import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar, Box, Card, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import { CloudUploadOutlined, DeleteOutlined } from '@material-ui/icons';
import CardBody from 'components/Card/CardBody';
import API from 'utils/http';

export default function GalleryDialog(props) {
    const [currentFiles, setCurrentFiles] = useState([]);

    const handleFileDrop = (files) => {
        let updatedFiles = files.map(x => (
            {
                image: x,
                is360: false,
                alt_text: ""
            }
        ));

        if (currentFiles.length > 0) {
            setCurrentFiles([...currentFiles, ...updatedFiles]);
        } else {
            setCurrentFiles(updatedFiles);
        }
    }

    const handleImageAltChange = (e, index) => {
        let updatedFiles = [...currentFiles];
        updatedFiles[index].alt_text = e.target.value;
        setCurrentFiles(updatedFiles)
    }

    const handleMultipleSubmit = () => {
        let imagesFormData = new FormData();
        currentFiles.forEach(x => {
            imagesFormData.append("images[]", x.image);
            imagesFormData.append("data[]", JSON.stringify(x))
        })
        API.post(`/multiple_upload`, imagesFormData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
            }
        }).then(response => {
            if (response.status === 200) {
                alert("Files Uploaded");
                setCurrentFiles([]);
                props.refreshGallery();
            }
        }).catch(err => alert("Something went wrong"));
    }

    // const getCheckedValue = (checked) => {
    //     if (props.isSingle) {
    //         return props.isSingle && checked
    //     } else if(props.isBanner){
    //         return props.isBanner && checked
    //     }else{
    //         return !props.isSingle && !props.isBanner && checked
    //     }
    // }

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="md" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Select Images</DialogTitle>
                <DialogContent>
                    {/* <Grid container spacing={2}> */}
                    <div className="add-fallery-wrapper">
                        <Box marginBottom={4}>
                            <h6>If the image you are looking for is not in gallery, then add it here first.</h6>
                            <DropzoneArea
                                // showPreviews={true}
                                dropzoneClass="dropzone-wrapper-small"
                                Icon={CloudUploadOutlined}
                                showAlerts={false}
                                acceptedFiles={['image/*']}
                                filesLimit={15}
                                showPreviewsInDropzone={false}
                                showFileNamesInPreview={false}
                                onDrop={handleFileDrop}
                                // useChipsForPreview
                                dropzoneText="Drag and Drop Images here or simply click here"
                                previewGridProps={{ container: { spacing: 1, direction: 'row', wrap: 'nowrap', style: { overflowX: 'auto', padding: '1rem' } }, item: { xs: 3 } }}
                                // previewChipProps={}
                                previewText="Selected files"
                            />
                        </Box>
                        {
                            currentFiles.length > 0 &&
                            <Box marginBottom={4}>
                                <Card>
                                    <CardBody>
                                        <form type="post" encType="multipart/form-data">

                                            <Grid container spacing={1}>

                                                {
                                                    currentFiles.map((x, i) => (
                                                        <>
                                                            <Grid item xs={12} sm={1}>
                                                                <Avatar src={URL.createObjectURL(x.image)} alt={x.alt_text || ""} />
                                                            </Grid>
                                                            <Grid item xs={12} sm={5}>
                                                                <TextField
                                                                    required
                                                                    id={`alt_text${i}`}
                                                                    name="alt_text"
                                                                    label="Image Alt Text"
                                                                    value={x.alt_text}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    onChange={(e) => handleImageAltChange(e, i)}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={5}>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup aria-label="is360" row defaultChecked name="is360" value={x.is360} onChange={(e) => {
                                                                        setCurrentFiles(
                                                                            currentFiles.map((y, ind) => {
                                                                                if (ind === i) {
                                                                                    return { ...y, is360: !y.is360 }
                                                                                } else {
                                                                                    return y
                                                                                }
                                                                            })
                                                                        )
                                                                    }}>
                                                                        <FormControlLabel value={false} control={<Radio />} label="Regular/Slider" />
                                                                        <FormControlLabel value={true} control={<Radio />} label={<span>360<sup>o</sup> View</span>} />
                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item xs={12} sm={1}>
                                                                <Button variant="outlined" color="secondary" onClick={() => setCurrentFiles([...currentFiles.filter((z, index) => index !== i)])}>
                                                                    <DeleteOutlined />
                                                                </Button>
                                                            </Grid>
                                                        </>
                                                    ))
                                                }
                                                {
                                                    currentFiles.length > 0 &&
                                                    <Grid item xs={12} sm={12}>
                                                        <Button variant="contained" size="small" color="primary" onClick={handleMultipleSubmit} style={{ float: 'right', marginTop: '1rem' }} >
                                                            Upload New Images
                                                        </Button>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </form>
                                    </CardBody>
                                </Card>
                            </Box>
                        }
                    </div>
                    <div className="d-flex flex-wrap gallery-grid">
                        {
                            props.data?.map((x, index) => (
                                <FormControlLabel
                                    style={{ width: '25%', margin: 0 }}
                                    control={<Checkbox checked={x.checked} style={{ width: '100%' }} onChange={(e) => props.handleImageSelect(e, index, props.section)} color="primary" icon={<div style={{ width: '100%', height: '150px' }}>
                                        <img className="img-thumbnail" width="100%" style={{ height: '100%', objectFit: 'cover' }} src={x.avatar} alt="" />
                                    </div>} checkedIcon={
                                        <div style={{ width: '100%', height: '150px' }}>
                                            <img className="img-thumbnail" width="100%" src={x.avatar} alt="" style={{ height: '100%', objectFit: 'cover' }} />
                                            <div className="img-checked"></div>
                                        </div>
                                    } name="image" />}
                                />
                            ))
                        }
                    </div>
                    {/* </Grid> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} variant="contained" color="primary">
                        Done
                     </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}