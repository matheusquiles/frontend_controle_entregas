import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../styles/ColorModeIconDropdown';
import { MAIN_FONT_COLLOR, MAIN_YELLOW } from '../styles/Colors';
import SiteIcon from './SiteIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [entregasAnchorEl, setEntregasAnchorEl] = React.useState(null);
  const [configAnchorEl, setConfigAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEntregasMenuClick = (event) => {
    setEntregasAnchorEl(event.currentTarget);
  };

  const handleEntregasMenuClose = () => {
    setEntregasAnchorEl(null);
  };

  const handleConfigMenuClick = (event) => {
    setConfigAnchorEl(event.currentTarget);
  };

  const handleConfigMenuClose = () => {
    setConfigAnchorEl(null);
  };

  const onMenuClick = (callback) => {
    callback();
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 2 }}>
            <SiteIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" sx={{ color: MAIN_FONT_COLLOR }} size="small" onClick={() => onMenuClick(() => navigate('/coletas'))}>
                Coletas
              </Button>

              <Button variant="text" sx={{ color: MAIN_FONT_COLLOR }} size="small" onClick={handleEntregasMenuClick}>
                Entregas
              </Button>
              <Menu
                anchorEl={entregasAnchorEl}
                open={Boolean(entregasAnchorEl)}
                onClose={handleEntregasMenuClose}
              >
                <MenuItem onClick={() => { handleEntregasMenuClose(); navigate('/entregas/aprovar'); }}>Aprovar</MenuItem>
              </Menu>

              <Button variant="text" sx={{ color: MAIN_FONT_COLLOR }} size="small" onClick={handleConfigMenuClick}>
                Configurações
              </Button>
              <Menu
                anchorEl={configAnchorEl}
                open={Boolean(configAnchorEl)}
                onClose={handleConfigMenuClose}
              >
                <MenuItem onClick={handleMenuClick}>
                  Usuários
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/usuarios/novo'); }}>Novo</MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/usuarios/editar'); }}>Editar</MenuItem>
                  </Menu>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button onClick={() => handleLogout()} sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }} variant="contained" size="small">
              Sair
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 3 }} />
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}