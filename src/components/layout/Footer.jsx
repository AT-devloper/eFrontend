import { Box, Container, Typography, Stack, Link, IconButton, Divider, TextField, useTheme } from "@mui/material";
import { Instagram, Facebook, LinkedIn, ArrowForward } from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        // Using your theme's deep burgundy instead of pure black
        bgcolor: "primary.dark", 
        color: "primary.contrastText",
        pt: { xs: 8, md: 12 }, 
        pb: 6,
        width: "100%",
        // Soft gold border using secondary theme color
        borderTop: `1px solid ${theme.palette.secondary.main}33` // 33 adds low opacity
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: "column", lg: "row" }} 
          spacing={{ xs: 8, lg: 12 }}
          justifyContent="space-between"
        >
          {/* Section 1: The Newsletter */}
          <Box sx={{ flex: 1.5 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: 600, 
                mb: 2,
                color: "secondary.main" 
              }}
            >
              Join the Inner Circle
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 4, maxWidth: "400px" }}>
              Receive early access to new Indian collections and exclusive invitations to private showings.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 0, 
              borderBottom: `1px solid ${theme.palette.secondary.light}66`, 
              pb: 1, 
              maxWidth: "450px" 
            }}>
              <TextField 
                variant="standard" 
                placeholder="Email Address" 
                fullWidth
                InputProps={{ 
                  disableUnderline: true,
                  sx: { 
                    color: 'primary.contrastText', 
                    fontSize: '0.9rem', 
                    fontStyle: 'italic',
                    '&::placeholder': { color: 'primary.contrastText', opacity: 0.5 }
                  } 
                }}
              />
              <IconButton sx={{ color: "secondary.main", p: 0 }}>
                <ArrowForward fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Section 2: Links */}
          <Box sx={{ flex: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 6, sm: 10 }}>
              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3 }}>
                  MAISON
                </Typography>
                {['The Brand', 'Sustainability', 'Bespoke Services', 'Store Locator'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    color="inherit" 
                    underline="none" 
                    sx={{ 
                      fontSize: '0.85rem', 
                      opacity: 0.7,
                      transition: 'all 0.3s ease',
                      '&:hover': { opacity: 1, color: 'secondary.main', pl: 1 } 
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>

              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3 }}>
                  CLIENT CARE
                </Typography>
                {['Contact Us', 'Track Order', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    color="inherit" 
                    underline="none" 
                    sx={{ 
                      fontSize: '0.85rem', 
                      opacity: 0.7,
                      transition: '0.3s',
                      '&:hover': { opacity: 1, color: 'secondary.main', pl: 1 } 
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>

              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3 }}>
                  CONNECT
                </Typography>
                <Stack direction="row" spacing={2}>
                   {[<Instagram fontSize="small"/>, <Facebook fontSize="small"/>, <LinkedIn fontSize="small"/>].map((icon, i) => (
                     <Link key={i} href="#" sx={{ color: 'primary.contrastText', opacity: 0.7, '&:hover': { opacity: 1, color: 'secondary.main' } }}>
                        {icon}
                     </Link>
                   ))}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Huge Aesthetic Text Background */}
        <Box sx={{ mt: { xs: 8, md: 15 }, mb: { xs: 4, md: 0 }, overflow: 'hidden', userSelect: 'none' }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '15vw', md: '12vw' },
                fontWeight: 900,
                // Using a very faint gold for the watermark
                color: `${theme.palette.secondary.main}08`, 
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                lineHeight: 0.8,
                whiteSpace: 'nowrap'
              }}
            >
              AT-LUXE
            </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: "rgba(255, 255, 255, 0.05)" }} />

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          justifyContent="space-between" 
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 1 }}>
            © {currentYear} AT-LUXE. ESTABLISHED IN INDIA.
          </Typography>
          <Stack direction="row" spacing={3}>
             <Typography variant="caption" sx={{ opacity: 0.5 }}>ALL INDIA DELIVERY</Typography>
             <Typography variant="caption" sx={{ opacity: 0.5 }}>PAYMENT SECURED BY REZORPAY</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}