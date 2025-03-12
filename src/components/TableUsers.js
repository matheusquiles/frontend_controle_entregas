import React from 'react';
import '../styles/TableUsers.css';
import { useDispatch } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors'; 
import { useNavigate } from 'react-router-dom'; // Adicionar o useNavigate

const TableUsers = ({ data, onEdit }) => {
  const navigate = useNavigate(); // Hook para navegação

  const handleEditClick = (id) => {
    navigate(`/usuarios/editar/${id}`); // Redireciona para a rota com o ID
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} className="table-users-container">
        <Table className="table-users" sx={{ minWidth: 650 }} aria-label="tabela de usuários">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>User Key</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Tipo de Usuário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Coordenador</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.idUser} className={`data-row ${user.editing ? 'editing' : ''}`}>
                <TableCell>{user.idUser}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userKey}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.status ? 'Habilitado' : 'Desabilitado'}</TableCell>
                <TableCell>{user.coordinator || 'Nenhum'}</TableCell>
                <TableCell className="action-cell">
                  <button className="action-button" onClick={() => handleEditClick(user.idUser)}>
                    <EditIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableUsers;