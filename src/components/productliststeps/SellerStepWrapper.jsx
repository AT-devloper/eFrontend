import { Card, Typography, Box } from "@mui/material";

const SellerStepWrapper = ({ title, children }) => (
  <Card sx={{ p: { xs: 2, md: 4 } }}>
    <Typography variant="h5" mb={3}>
      {title}
    </Typography>
    <Box>{children}</Box>
  </Card>
);

export default SellerStepWrapper;
