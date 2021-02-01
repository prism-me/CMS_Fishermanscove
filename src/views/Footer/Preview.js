import React, { Fragment, Suspense, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";
import { MenuItem, Select, FormControl, TextField, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Facebook, Image, Instagram, Twitter } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function FooterPreview(props) {
  const classes = useStyles();

  return (
    <CardBody>
      <Grid container spacing={3}>
        <footer className="footer-two">
          <div className="footer-widget-area pt-30 pb-30">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-sm-6 order-1">
                  {/* Site Info Widget */}
                  <div className="widget site-info-widget mb-50">
                    <div className="footer-logo mb-1">
                      <img src={require('./../../assets/img/logo-fisher.png')} alt="fishermancove footer logo" />
                    </div>
                    <p>
                      Situated at Beau Vallon Beach with its 3km sparkling ivory sand, Fisherman’s Cove Resort is the promise of genuine tranquility and eternal enjoyment. The guest rooms and suites are set amidst lush tropical gardens, complemented by a peaceful environment.
                    </p>
                    <div className="social-links mt-40 d-none">
                      <a href="https://www.facebook.com/fishermanscoveresort/"><i className="fab fa-facebook-f" /></a>
                      <a href="https://twitter.com/fisherman_cove"><i className="fab fa-twitter" /></a>
                      <a href="https://www.instagram.com/fishermanscove.resort/"><i className="fab fa-instagram" /></a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 order-3 order-lg-2">
                  {/* Nav Widget */}
                  <div className="widget nav-widget mb-50">
                    <div>
                      <h4 className="widget-title">Services</h4>
                      <ul>

                        <li><Link to="/about">About Us</Link></li>

                        <li><Link to="/weddings">Weddings </Link></li>

                        <li><Link to="/room-suites">Rooms &amp; Suites</Link></li>

                        <li><Link to="/whats-on">Leisure Activities </Link></li>
                        <li><Link to="/dining">Dining</Link></li>


                        <li><Link to="/gallery">Media Center</Link></li>
                        <li><Link to="/spa-wellness">Spa</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
                        <li><Link to="/covid-policy">Covid-19 Policy</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6 order-2 order-lg-3">
                  {/* Contact Widget */}
                  <div className="widget contact-widget mb-50">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="contact-lists">
                      <div className="contact-box">
                        {/* <div className="icon">
                          <i className="flaticon-call" />
                        </div> */}
                        <div className="desc">
                          <h6 className="title">Phone Number</h6>
                          <a href="tel:+2484677000">+248 467 7000</a>
                        </div>
                      </div>
                      <div className="contact-box">
                        {/* <div className="icon">
                          <i className="flaticon-message" />
                        </div> */}
                        <div className="desc">
                          <h6 className="title">Email Address</h6>
                          <a href="mailto:reservations@fishermanscove-resort.com">reservations@fishermanscove-resort.com</a>
                        </div>
                      </div>
                      <div className="contact-box">
                        {/* <div className="icon">
                          <i className="flaticon-location-pin" />
                        </div> */}
                        <div className="desc">
                          <h6 className="title">Office Address</h6>
                          Fisherman's Cove Resort, Bel Ombre, P.O. Box 35, Victoria
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom-wrapper py-1">
              <div className="container d-flex flex-wrap justify-content-between align-items-center">
                <div className="py-2 footer-logos">
                  <a href="#"><img className="px-2" src={require('./../../assets/img/footer/story-hospitality-footer.png')} alt="story-rabat hospitality footer" /></a>
                  <a href="https://www.story-rabat.com/"><img className="px-2" src={require('./../../assets/img/footer/story-rabat-footer.png')} alt="sotry-rabat footer" /></a>
                  <a href="#"><img className="px-2" src={require('assets/img/footer/cue-hotel-footer.png')} alt="cue hotel footer" /></a>
                  <a href="https://www.hhoteldubai.com/"> <img className="px-2 hhotel-dubai-footer" src={require('./../../assets/img/footer/hhotel-footer.png')} alt="hhotel footer" /></a>
                  <a href="/"><img className="px-2" src={require('./../../assets/img/footer/logo-fisher.png')} alt="fishermanscove footer" /></a>
                </div>
                <div className="social-icons py-2">
                  <a href="https://www.facebook.com/fishermanscoveresort/"><Facebook/></a>
                  <a href="https://twitter.com/fisherman_cove"><Twitter/></a>
                  <a href="https://www.instagram.com/fishermanscove.resort/"><Instagram/></a>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright-area py-2">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-5 order-2 order-md-1">
                  <p className="copyright-text copyright-two">Copyright By @<Link to="#">Fishermans Cove Resort</Link> - {new Date().getFullYear()}</p>
                </div>
                <div className="col-lg-6 col-md-7 order-1 order-md-2">
                  <div className="footer-menu text-center text-md-right">
                    <ul>
                      <p style={{ fontSize: '14px' }}>Powered By <a href="https://prismdigital.ae" style={{ color: "white" }} >Prism Digital</a>.</p>
                      {/* <li><Link to="#">Terms of use</Link></li>
                      <li><Link to="#">Privacy Environmental Policy</Link></li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </Grid>
    </CardBody>
  );
}
