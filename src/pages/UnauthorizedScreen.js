import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function UnauthorizedScreen() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh' }}>
      <LockIcon style={{ color: '#FFBF26', fontSize: 48 }} />
      <p style={{ margin: '10px 0' }}>Acesso Negado</p>
      <Button variant="contained" onClick={handleBackClick} style={{ backgroundColor: '#FFBF26', color: '#fff' }}>
        Voltar
      </Button>
    </div>
  );
}

export default UnauthorizedScreen;