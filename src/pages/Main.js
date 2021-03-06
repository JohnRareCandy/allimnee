import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TodayIcon from "@material-ui/icons/Today";
import RoomIcon from "@material-ui/icons/Room";
import { NavLink } from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import Hidden from "@material-ui/core/Hidden";
import qs from "query-string";

import InfiniteUsers from "../components/examples/InfiniteUsers";

import Filter from "../components/Filter";
import Level from "../components/Filter/Level";
import { sortClass } from "../redux/selectors";

// fetch api
import { getAllClasses as FGetClasses, getTutorNameAndImage } from "../api";

// helper
import { getRandomImage, isBrowser } from "../helper";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  navLink: {
    textDecoration: "none",
    color: "black"
  },
  inline: {
    display: "inline"
  },
  paperStyles: {
    height: "88vh"
  },
  divider: {
    height: theme.spacing(2)
  },
  subjectStyle: {
    [theme.breakpoints.down("xs")]: {
      fontSize: 15
    }
  },
  locationIcon: { fontSize: 15, marginRight: 3 },
  [theme.breakpoints.down("sm")]: {
    locationIcon: { color: "red" }
  }
}));

function MainApp(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const [ssr, setSsr] = React.useState("css");
  console.log('pre-fetched by server? ', props.hasFetch)

  // React.useEffect(() => {
  //   setSsr("js");
  // }, [ssr]);
  console.log("ssr: ", ssr);

  const [img, setImg] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    console.log(`you are now at page: ${newPage}`);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function popImg() {
    const imgSrc = await getRandomImage();
    setImg(imgSrc);
  }

  async function fetchClass() {
    console.info("running [FE] fetch(Main)....");
    // id will be synchronize with uri
    // get id from uri
    let classList = await FGetClasses();
    props.updateClassList({ type: "updateClassList", initialData: classList });
  }

  React.useEffect(() => {
    const abort = new AbortController();
    // popImg();

    if (!props.hasFetch) fetchClass();
    return function cleanup() {
      // ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      console.log('running AbortController...')
      abort.abort();

    };
  }, []);

  const lookupTable = {
    "Lower Primary": [1, 2, 3],
    "Upper Primary": [4, 5, 6],
    "Lower Secondary": [7, 8],
    "Upper Secondary": [9, 10, 11],
    NITEC: [12],
    JC1: [13],
    JC2: [14],
    Poly: [15]
  };

  function isSubsetOf(target, ref) {
    return target.every(item => ref.includes(item));
  }

  function getLevelText(levelList) {
    for (let [key, value] of Object.entries(lookupTable)) {
      if (isSubsetOf(levelList, value)) return key;
    }
  }

  // grab user query param (use this for URI persistent refresh)
  const userQuery = qs.parse(props.location.search);
  // console.log(`[FE]userQuery: ${JSON.stringify(userQuery)}`);
  // console.log(qs.stringify(userQuery))

  function renderLocation(location) {
    if (isMobileOrTablet) {
      // console.log('view: mobile/tablet')
      return (
        <Typography
          variant="body2"
          align="right"
          display="block"
          noWrap
          style={{ color: "rgba(0, 0, 0, 0.54)" }}
        >
          <RoomIcon className={classes.locationIcon} />
          {location}
        </Typography>
      );
    } else {
      // console.log('view: desktop')

      return (
        <Typography variant="body2" align="right" style={{ color: "green" }}>
          <RoomIcon className={classes.locationIcon} />
          {location}
        </Typography>
      );
    }
  }

  // get tutor_id from props.classes
  // const list_tutor_id = props.classes.map(eachClass => eachClass._id).join(',');

  function renderClasses() {
    const classList = props.classes;
    // console.log(props.classes)
    return classList
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(thisClass => {
        // popImg();
        return (
          <React.Fragment key={thisClass._id}>
            <ListItem>
              <Grid container>
                <Grid item container direction="row" xs={9} md={4}>
                  <Hidden smDown>
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={thisClass.img} />
                    </ListItemAvatar>
                  </Hidden>

                  <ListItemText
                    primary={
                      <NavLink to="/browse" className={classes.navLink}>
                        <Typography
                          variant="body1"
                          className={classes.subjectStyle}
                        >
                          {getLevelText(thisClass.level)}, {thisClass.subject}
                        </Typography>
                      </NavLink>
                    }
                    secondary={
                      <React.Fragment>
                        <TodayIcon style={{ fontSize: 15, marginRight: 3 }} />
                        <span style={{ verticalAlign: "text-bottom" }}>
                          {thisClass.datetime}
                        </span>
                      </React.Fragment>
                    }
                  />
                </Grid>
                <Grid item xs={3} md={4}>
                  <ListItemText secondary={renderLocation(thisClass.location)} />
                </Grid>
                <Hidden smDown>
                  <Grid item md={4}>
                    <ListItemText
                      secondary={
                        <Typography variant="subtitle1" align="right">
                          {thisClass.name}
                        </Typography>
                      }
                    />
                  </Grid>
                </Hidden>
              </Grid>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        )
      });
  }

  function renderMain() {
    if (isMobileOrTablet) {
      return (<InfiniteUsers overallState={props.mainClassObj} updateWholeClassObj={props.updateWholeClassObj} updateError={props.updateError} mergeNewUsers={props.mergeNewUsers} />)
    } else {
      return (
        <React.Fragment>
          <List className={classes.root}>{renderClasses()}</List>
          <TablePagination
            rowsPerPageOptions={[2, 5, 10]}
            component="div"
            count={props.classes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </React.Fragment>
      )
    }
  }

  return (
    <Grid container>
      <Hidden implementation={ssr} smDown>
        <Grid item md={2}>
          <Filter isBrowseClass />
        </Grid>
      </Hidden>

      <Grid item md={10} xs={12}>
        <MainBody screen={useMediaQuery(theme.breakpoints.only("sm"))}>
          {renderMain()}
        </MainBody>
      </Grid>
    </Grid>
  );
}

function MainBody(props) {
  console.log('props.screen', props.screen)
  // if screen within sm range, adjust 'Filter Subject' alignment
  if (props.screen)
    return (
      <React.Fragment>
        <div style={{ margin: "0 5%" }}>
          <Level />
        </div>

        {props.children}
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <Container fixed>
        <Level />
      </Container>
      {props.children}
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  classes: sortClass(state.classes.users, state.filterClass),
  hasFetch: state.hasFetch,
  mainClassObj: state.classes,
});

// testing mapDispatchToProps
const mapDispatchToProps = dispatch => {
  return {
    updateClassList: data => dispatch(data),
    updateWholeClassObj: data => dispatch(data),
    mergeNewUsers: data => dispatch(data),
    updateError: data => dispatch(data),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
