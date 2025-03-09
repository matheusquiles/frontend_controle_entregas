import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import { MAIN_YELLOW, MAIN_FONT_COLLOR } from '../styles/Colors'; 

const TableUsers = ({ users, onEdit }) => {
  const dispatch = useDispatch();

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>User Key</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Tipo de Usuário</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell> {/* Coluna para o botão Editar */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.idUser}>
                <TableCell>{user.idUser}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.userKey}</TableCell>
                <TableCell>{user.cpf }</TableCell> 
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>
                  {user.status ? 'Habilitado' : 'Desabilitado'} {/* Converte true/false para texto */}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onEdit(user.idUser)} 
                    sx={{ color: MAIN_YELLOW }}
                  >
                    <EditIcon />
                  </IconButton>
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