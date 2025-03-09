import React, { useState, useEffect } from 'react';
import '../styles/CollectTable.css';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const CollectTable = ({ data, onDataChange }) => {
  const [tableData, setTableData] = useState(data);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const groupedData = tableData.reduce((acc, collect) => {
    const key = `${collect.date}-${collect.edressDescription}`;
    if (!acc[key]) {
      acc[key] = {
        date: collect.date,
        edressDescription: collect.edressDescription,
        collects: [],
      };
    }
    acc[key].collects.push(collect);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEdit = (collectId, itemIndex) => {
    setEditRow(`${collectId}-${itemIndex}`);
  };

  const handleSave = (collectId, itemIndex) => {
    setEditRow(null);
    onDataChange(tableData); // Notifica o componente pai sobre as alterações
  };

  const handleChange = (collectId, itemIndex, field, value) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) => {
          if (idx === itemIndex) {
            const numericValue = parseFloat(value) || 0;
            const updatedItem = { ...item, [field]: numericValue };
            updatedItem.totalToReceive = updatedItem.valuePerUnitCollect * updatedItem.quantity;
            updatedItem.totalValueToPay = updatedItem.valueToPayPerUnit * updatedItem.quantity;
            return updatedItem;
          }
          return item;
        });
        return { ...collect, itens: updatedItens };
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData); // Notifica o componente pai imediatamente
  };

  const handleApprove = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Aprovado' } : item
        );
        return { ...collect, itens: updatedItens, status: true }; // Define status como true para Aprovado
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData); // Notifica o componente pai
  };

  const handleReject = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Reprovado' } : item
        );
        return { ...collect, itens: updatedItens, status: false }; // Define status como false para Reprovado
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData); // Notifica o componente pai
  };

  return (
    <div className="collect-table-container">
      <table className="collect-table">
        <thead>
          <tr>
            <th>Motoboy</th>
            <th>Data</th>
            <th>Cliente/Endereço</th>
            <th>Tipo de Coleta</th>
            <th>Quantidade</th>
            <th>R$ por Unidade</th>
            <th>R$ Total a Receber</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => {
            let rowSpanCount = 0;
            group.collects.forEach(collect => {
              rowSpanCount += collect.itens.length;
            });

            return group.collects.map((collect, collectIndex) =>
              collect.itens.map((item, itemIndex) => {
                const rowKey = `${collect.idCollect}-${itemIndex}`;
                const isEditing = editRow === rowKey;
                const isApproved = item.deliveryStatus === 'Aprovado';
                const isRejected = item.deliveryStatus === 'Reprovado';

                return (
                  <tr key={rowKey} className={`data-row ${isEditing ? 'editing' : ''}`}>
                    {collectIndex === 0 && itemIndex === 0 ? (
                      <>
                        <td rowSpan={rowSpanCount}>{collect.collectUser}</td>
                        <td rowSpan={rowSpanCount}>{group.date}</td>
                        <td rowSpan={rowSpanCount}>{group.edressDescription}</td>
                      </>
                    ) : null}
                    <td>{item.collectType}</td>
                    <td>
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleChange(collect.idCollect, itemIndex, 'quantity', e.target.value)}
                          type="number"
                          inputProps={{ step: '1' }}
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.valuePerUnitCollect}
                          onChange={(e) => handleChange(collect.idCollect, itemIndex, 'valuePerUnitCollect', e.target.value)}
                          type="number"
                          inputProps={{ step: '0.01' }}
                        />
                      ) : (
                        formatCurrency(item.valuePerUnitCollect)
                      )}
                    </td>
                    <td>{formatCurrency(item.totalToReceive)}</td>
                    <td>{item.deliveryStatus ?? '-'}</td>
                    <td>
                      {isEditing ? (
                        <IconButton onClick={() => handleSave(collect.idCollect, itemIndex)} color="primary">
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => handleApprove(collect.idCollect, itemIndex)}
                            color={isApproved ? 'success' : 'default'}
                            sx={{ color: isApproved ? undefined : '#bdbdbd' }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleReject(collect.idCollect, itemIndex)}
                            color={isRejected ? 'error' : 'default'}
                            sx={{ color: isRejected ? undefined : '#bdbdbd' }}
                          >
                            <CancelIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(collect.idCollect, itemIndex)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CollectTable;