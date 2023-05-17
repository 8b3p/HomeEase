import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#292929',
      paper: '#292929',
    }
  },
});

export default darkTheme;
