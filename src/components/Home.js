import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar.js';
import AppTheme from '../styles/theme/AppTheme.js';
import { Toolbar, Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../api/api';

import { registerLocale } from 'react-datepicker';
registerLocale('pt-BR', ptBR);

dayjs.locale('pt-br');

const Home = (props) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [cachedUserName, setCachedUserName] = useState(localStorage.getItem('userName') || 'Usuário');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [coletas, setColetas] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [totalColetasValue, setTotalColetasValue] = useState(0);
  const [totalEntregasValue, setTotalEntregasValue] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user?.name) {
      localStorage.setItem('userName', user.name);
      setCachedUserName(user.name);
    }
  }, [user]);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const fetchData = async (selectedDate) => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    setHasError(false);

    try {
      const [resColetas, resEntregas] = await Promise.all([
        api.post('/api/collects/report/collects', { date: formattedDate }),
        api.post('/api/deliveries/report/deliveries', { date: formattedDate })
      ]);

      setColetas(resColetas.data.byType || []);
      setTotalColetasValue(resColetas.data.totalValue || 0);

      setEntregas(resEntregas.data.byRegion || []);
      setTotalEntregasValue(resEntregas.data.totalValue || 0);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setHasError(true);
      setColetas([]);
      setEntregas([]);
    }
  };

  const totalColetas = coletas.reduce((acc, c) => acc + c.quantity, 0);
  const totalEntregas = entregas.reduce(
    (acc, regiao) => acc + regiao.deliveries.reduce((soma, t) => soma + t.quantity, 0),
    0
  );

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Toolbar />
      <Box
        component="main"
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 4 },
          maxWidth: 'lg',
          mx: 'auto',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {loading ? (
              <Typography variant="h5">Carregando...</Typography>
            ) : (
              <>
                <Typography variant="h4" fontWeight="bold">
                  Bem-vindo, {cachedUserName}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {dayjs(selectedDate).format('dddd, D [de] MMMM [de] YYYY')}
                </Typography>
              </>
            )}
          </Box>

          <Box sx={{ ml: 'auto', position: 'relative' }}>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Selecionar data
            </Typography>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="custom-datepicker"
            />
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Coletas do dia
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {hasError ? (
            <Typography variant="body1" color="text.secondary">
              Sem dados para exibir.
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Quantidade total: {totalColetas}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                R$ Total: R$ {totalColetasValue.toFixed(2)}
              </Typography>
              <Grid container spacing={2}>
                {coletas.map((coleta, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1">{coleta.type}</Typography>
                      <Typography variant="body2">Quantidade: {coleta.quantity}</Typography>
                      <Typography variant="body2">Valor: R$ {coleta.value.toFixed(2)}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Entregas do dia
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {hasError ? (
            <Typography variant="body1" color="text.secondary">
              Sem dados para exibir.
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Quantidade total: {totalEntregas}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                R$ Total: R$ {totalEntregasValue.toFixed(2)}
              </Typography>
              {entregas.map((regiao, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Região: <strong>{regiao.region}</strong>
                  </Typography>
                  <Grid container spacing={2}>
                    {regiao.deliveries.map((entrega, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{entrega.type}</Typography>
                          <Typography variant="body2">Quantidade: {entrega.quantity}</Typography>
                          <Typography variant="body2">Valor: R$ {entrega.value.toFixed(2)}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </>
          )}
        </Paper>
      </Box>
    </AppTheme>
  );
};

export default Home;