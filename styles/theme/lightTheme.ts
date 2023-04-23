import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#fff',
    }
  },
});

export default lightTheme;
