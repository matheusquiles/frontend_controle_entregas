import React, { useState } from 'react'; 
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogActions, Button as MuiButton } from '@mui/material';
import { resetForm, setEditing, resetTableData } from '../redux/reducers/FormSlice';
import { useNavigate } from 'react-router-dom';

const FormButtons = ({ handleSubmit, isLoading, isUpdating, btEnviar, back, enableCancel = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleCancelClick = () => {
    setOpenConfirm(true); 
  };

  const confirmCancel = () => {
    dispatch(resetForm()); 
    dispatch(resetTableData()); 
    dispatch(setEditing(true));
    setOpenConfirm(false); 
  };

  const handleVoltarClick = () => {
    dispatch(resetForm());
    navigate(back || '/home');
  };

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        onClick={handleVoltarClick}
        sx={{ color: MAIN_YELLOW, borderColor: MAIN_YELLOW }}
      >
        Voltar
      </Button>
      <Button
        type="button"
        variant="outlined"
        onClick={handleCancelClick}
        sx={{ color: MAIN_YELLOW, borderColor: MAIN_YELLOW }}
        disabled={!enableCancel}
      >
        Cancelar
      </Button>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar Cancelamento</DialogTitle>
        <DialogActions>
          <MuiButton onClick={() => setOpenConfirm(false)} color="primary">
            Não
          </MuiButton>
          <MuiButton onClick={confirmCancel} color="secondary">
            Sim
          </MuiButton>
        </DialogActions>
      </Dialog>
      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
        startDecorator={isUpdating ? <CircularProgress variant="solid" /> : null}
        sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }}
        variant="contained"
      >
        {isLoading ? btEnviar + '...' : (btEnviar || 'Cadastrar')}
      </Button>
    </>
  );
};

export default FormButtons;