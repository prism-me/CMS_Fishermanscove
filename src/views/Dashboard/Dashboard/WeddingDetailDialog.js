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
import { Grid, FormControl, FormControlLabel, Radio, RadioGroup, Card } from '@material-ui/core';
import CardBody from 'components/Card/CardBody';

export default function WeddingDetailDialog(props) {
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Booking Request</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.1)', fontSize:'14px !important' }}>
                                <CardBody>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>First Name: </span>{
                                                props.wedding?.name
                                            } </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>Surname: </span>{
                                                props.wedding?.sr_name
                                            } </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}> Email: </span>{
                                                props.wedding?.email
                                            } </span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>Contact: </span>{
                                                props.wedding?.contact_number
                                            } </span>
                                        </Grid>
                                    </Grid>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
                                <CardBody>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>No. of Pax: </span>{
                                                props.wedding?.number_of_pax
                                            }</span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>Package: </span>{
                                                props.wedding?.package_choosen
                                            }</span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}> Pref. Date 1: </span>{
                                                new Date().toLocaleDateString()
                                                // new Date(props.wedding?.pr_date_1).toLocaleDateString()
                                            }</span>
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <span><span style={{fontWeight:400}}>Pref. Date 2: </span>{
                                                new Date().toLocaleDateString()
                                                // new Date(props.wedding?.pr_date_2).toLocaleDateString()
                                            }</span>
                                        </Grid>
                                    </Grid>
                                </CardBody>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Card style={{ boxShadow: '0 0 8px rgba(0,0,0,0.1)' }}>
                                <CardBody>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>
                                            {
                                                props.wedding?.remark || "Remark goes here"
                                            }
                                        </Grid>
                                    </Grid>
                                </CardBody>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}