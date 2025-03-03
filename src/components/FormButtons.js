import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors';
import { useDispatch } from 'react-redux';
import { resetForm } from '../redux/reducers/FormSlice';
import { useNavigate } from 'react-router-dom';

const FormButtons = ({ handleSubmit, isLoading, isUpdating, btEnviar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCancelClick = () => {
    dispatch(resetForm());
  };

  const handleVoltarClick = () => {
    dispatch(resetForm());
    navigate('/home');
  };

return (
    <>
        <Button
            type="button"
            variant='outlined'
            onClick={handleVoltarClick}
            sx={{ color: MAIN_YELLOW, borderColor: MAIN_YELLOW }}
        >
            Voltar 
        </Button>
        <Button
            type="button"
            variant='outlined'
            onClick={handleCancelClick}
            sx={{ color: MAIN_YELLOW, borderColor: MAIN_YELLOW }}
        >
            Cancelar
        </Button>
        <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            startDecorator={isUpdating ? <CircularProgress variant="solid" /> : null}
            sx={{ bgcolor: MAIN_YELLOW, color: MAIN_FONT_COLLOR }} variant="contained"
        >
            {isLoading ? btEnviar + '...' : (btEnviar || 'Cadastrar')}
        </Button>
    </>
);
};

export default FormButtons;