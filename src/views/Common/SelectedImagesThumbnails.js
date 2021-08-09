import React from 'react';
import CancelIcon from "@material-ui/icons/Cancel";
import Grid from "@material-ui/core/Grid";

const SelectedImagesThumbnails = (props) => {
    let {handleRemoveSelectedImage,x} = props;
    return (
            <Grid item xs={12} sm={2}>
                <div style={{height: "120px"}}>
                    <div className="d-flex position-absolute" style={{cursor: "pointer"}}>
                        <CancelIcon onClick={()=>{
                            handleRemoveSelectedImage(x);
                        }}/>
                    </div>
                    <img
                        width="100%"
                        src={x.avatar}
                        className="img-thumbnail"
                        alt=""
                        style={{height: "90%", objectFit: "cover"}}
                    />
                    <p style={{fontSize: "12px"}} className="text-center">
                        {x.alt_tag}
                    </p>
                </div>
            </Grid>
    );
};

export default SelectedImagesThumbnails;