import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  typography: {
    fontFamily: 'Nunito',
  },
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
});

export default lightTheme;
