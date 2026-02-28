import { Box, Container, Typography, Stack, Link, IconButton, Divider, TextField, useTheme } from "@mui/material";
// Added the 'X' icon to your imports here:
import { Instagram, Facebook, LinkedIn, ArrowForward, X } from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // Added the X (Twitter) URL and icon here:
  const socialLinks = [
    { icon: <Instagram />, url: "https://www.instagram.com/" },
    { icon: <Facebook />, url: "https://www.facebook.com/" },
    { icon: <X />, url: "https://x.com/" }, 
    { icon: <LinkedIn />, url: "https://www.linkedin.com/" }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: "primary.dark", 
        color: "primary.contrastText",
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 4, md: 6 },
        width: "100%",
        borderTop: `1px solid ${theme.palette.secondary.main}33`,
        overflow: "hidden" 
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: "column", lg: "row" }} 
          spacing={{ xs: 8, lg: 12 }} 
          justifyContent="space-between"
        >
          {/* Section 1: The Newsletter */}
          <Box sx={{ flex: 1.2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: 600, 
                mb: 2,
                color: "secondary.main",
                letterSpacing: 1
              }}
            >
              Join the Inner Circle
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8, 
                mb: 4, 
                maxWidth: "400px",
                lineHeight: 1.8 
              }}
            >
              Receive early access to new Indian collections and exclusive invitations to private showings.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.secondary.main}80`,
              pb: 1, 
              maxWidth: { xs: "100%", sm: "400px" }
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
              <IconButton size="small" sx={{ color: "secondary.main" }}>
                <ArrowForward fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Section 2: Links */}
          <Box sx={{ flex: 2 }}>
            <Box 
              sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, 
                columnGap: 4,
                rowGap: { xs: 6, sm: 0 }
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3, lineHeight: 1 }}>
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
                      width: "fit-content",
                      '&:hover': { opacity: 1, color: 'secondary.main', transform: 'translateX(4px)' } 
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>

              <Stack spacing={2.5}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3, lineHeight: 1 }}>
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
                      width: "fit-content",
                      '&:hover': { opacity: 1, color: 'secondary.main', transform: 'translateX(4px)' }
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>

              {/* CONNECT SECTION - Now with X (Twitter) */}
              <Stack spacing={2.5} sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}>
                <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 3, lineHeight: 1 }}>
                  CONNECT
                </Typography>
                <Stack direction="row" spacing={2.5}>
                   {socialLinks.map((social, i) => (
                     <Link 
                        key={i} 
                        href={social.url}          
                        target="_blank"            
                        rel="noopener noreferrer"  
                        sx={{ 
                          color: 'primary.contrastText', 
                          opacity: 0.7, 
                          transition: '0.3s',
                          display: 'flex',         
                          '&:hover': { opacity: 1, color: 'secondary.main', transform: 'translateY(-3px)' } 
                        }}
                      >
                        {social.icon}
                     </Link>
                   ))}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* Huge Aesthetic Text Background */}
        <Box sx={{ mt: { xs: 8, md: 15 }, mb: { xs: 2, md: 0 }, overflow: 'hidden', userSelect: 'none', width: "100%" }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '16vw', sm: '15vw', md: '12vw' }, 
                fontWeight: 900,
                color: `${theme.palette.secondary.main}08`, 
                fontFamily: "'Playfair Display', serif",
                textAlign: 'center',
                lineHeight: 0.8,
                whiteSpace: 'nowrap',
                letterSpacing: { xs: 0, md: -2 }
              }}
            >
              AT-LUXE
            </Typography>
        </Box>

        <Divider sx={{ mb: { xs: 3, md: 4 }, borderColor: "rgba(216, 182, 123, 0.15)" }} />

        {/* Bottom Bar */}
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          justifyContent="space-between" 
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={{ xs: 2, md: 0 }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.5, 
              letterSpacing: 1, 
              order: { xs: 2, md: 1 } 
            }}
          >
            © {currentYear} AT-LUXE. ESTABLISHED IN INDIA.
          </Typography>
          
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={{ xs: 1, sm: 3 }} 
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ order: { xs: 1, md: 2 } }}
          >
          
             <Typography variant="caption" sx={{ opacity: 0.6, letterSpacing: 1 }}>PAYMENT SECURED BY RAZORPAY</Typography> 
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}