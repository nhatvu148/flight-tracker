import React from "react";
import Image from "next/image";

// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";

import carouselStyle from "styles/jss/nextjs-material-kit-pro/pages/componentsSections/carouselStyle.js";

const useStyles = makeStyles(carouselStyle);

export default function SectionCarousel() {
  const classes = useStyles();
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div className={classes.section} id="carousel">
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12} className={classes.marginAuto}>
            <Card>
              <Carousel {...settings}>
                <Image
                  src={`/img/nextjs_header.jpeg`}
                  alt="..."
                  width={1100}
                  height={1100}
                />
                <Image
                  src={`/img/bg2.jpg`}
                  alt="..."
                  width={1100}
                  height={1100}
                />
                <Image
                  src={`/img/bg3.jpg`}
                  alt="..."
                  width={1100}
                  height={1100}
                />
              </Carousel>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
