import { useRouter } from "next/router";

// @material-ui/icons
import Search from "@material-ui/icons/Search";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// core components
import Header from "components/Header/Header.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import navbarsStyle from "styles/jss/nextjs-material-kit-pro/pages/componentsSections/navbarsStyle.js";

const useStyles = makeStyles(navbarsStyle);

const SectionNavbars = () => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Header
      brand="Flight Tracker"
      fixed
      color="dark"
      // changeColorOnScroll={{
      //   height: 400,
      //   color: "info",
      // }}
      links={
        <div className={classes.collapse}>
          <List className={classes.list + " " + classes.mrAuto}>
            <ListItem className={classes.listItem}>
              <Button
                className={classes.navLink}
                onClick={(e) => {
                  // router.push("/now-playing");
                }}
                color="transparent"
              >
                Now Playing
              </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Button
                className={classes.navLink}
                onClick={(e) => {
                  // router.push("/popular");
                }}
                color="transparent"
              >
                Popular
              </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Button
                className={classes.navLink}
                onClick={(e) => {
                  // router.push("/top-rated");
                }}
                color="transparent"
              >
                Top Rated
              </Button>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Button
                className={classes.navLink}
                onClick={(e) => {
                  // router.push("/upcoming");
                }}
                color="transparent"
              >
                Upcoming
              </Button>
            </ListItem>
          </List>
          <div className={classes.mlAuto}>
            <CustomInput
              white
              inputRootCustomClasses={classes.inputRootCustomClasses}
              formControlProps={{
                className: classes.formControl,
              }}
              inputProps={{
                placeholder: "Search",
                inputProps: {
                  "aria-label": "Search",
                  className: classes.searchInput,
                },
              }}
            />
            <Button color="white" justIcon round>
              <Search className={classes.searchIcon} />
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default SectionNavbars;
