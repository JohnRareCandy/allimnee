import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

// Create a theme instance. Global css variable
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6"
    },
    secondary: {
      main: "#19857b"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fff"
    },
    icon: {
      default: "#fff"
    }
  },
  buttonIcon: {
    fontSize: 32,
    color: "#fff"
  },
  overrides: {
    MuiRadio: {
      colorPrimary: {
        color: 'red'
      }
    },
    MuiTypography: {
      h6: {
        color: 'red'
      }
    }
  }
});

export default theme;
