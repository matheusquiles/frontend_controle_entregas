import React, { useState, useEffect } from 'react';
import '../styles/CollectTable.css';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const CollectTable = ({ data }) => {
  const [editRow, setEditRow] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setTableData(data);
    }
  }, [data]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <div>Sem dados para exibir</div>;
  }

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
    // Lógica para salvar no banco pode ser adicionada aqui
  };

  const handleChange = (collectId, itemIndex, field, value) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) => {
          if (idx === itemIndex) {
            // Converte o valor para número, lidando com entradas das setas ou digitação
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
  };

  const handleApprove = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Aprovado' } : item
        );
        return { ...collect, itens: updatedItens };
      }
      return collect;
    });
    setTableData(updatedData);
  };

  const handleReject = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Reprovado' } : item
        );
        return { ...collect, itens: updatedItens };
      }
      return collect;
    });
    setTableData(updatedData);
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
            <th>R$ a Pagar por Unidade</th>
            <th>R$ Total a Pagar</th>
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
                const originalItem = data.find(c => c.idCollect === collect.idCollect)?.itens[itemIndex];
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
                    <td style={{ backgroundColor: isEditing && item.quantity !== originalItem?.quantity ? '#fff3e0' : '' }}>
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
                    <td style={{ backgroundColor: isEditing && item.valuePerUnitCollect !== originalItem?.valuePerUnitCollect ? '#fff3e0' : '' }}>
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
                    <td style={{ backgroundColor: isEditing && item.valueToPayPerUnit !== originalItem?.valueToPayPerUnit ? '#fff3e0' : '' }}>
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.valueToPayPerUnit}
                          onChange={(e) => handleChange(collect.idCollect, itemIndex, 'valueToPayPerUnit', e.target.value)}
                          type="number"
                          inputProps={{ step: '0.01' }}
                        />
                      ) : (
                        formatCurrency(item.valueToPayPerUnit)
                      )}
                    </td>
                    <td>{formatCurrency(item.totalValueToPay)}</td>
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