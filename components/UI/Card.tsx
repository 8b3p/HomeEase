import { Box } from "@mui/material";
import { styled } from '@mui/material/styles'

interface props {
  children: React.ReactNode;
  className?: string;
}
const StyledBox = styled(Box)(({ theme }) => {
  return ({
    padding: "1rem",
    borderRadius: "0.5rem",
    width: "fit-content",
    height: "fit-content",
    boxShadow: theme.shadows[5],
  })
})

const Card = ({ children, className }: props) => {
  return <StyledBox className={className}>{children}</StyledBox>;
};

export default Card;
