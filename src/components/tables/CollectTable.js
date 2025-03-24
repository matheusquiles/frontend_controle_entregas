import React, { useState, useEffect } from 'react';
import '../../styles/CollectTable.css';
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
    const key = `${collect.date}-${collect.edressDescription}-${collect.collectUser}`;
    if (!acc[key]) {
      acc[key] = {
        date: collect.date,
        edressDescription: collect.edressDescription,
        collectUser: collect.collectUser,
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
    onDataChange(tableData);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (collectId, itemIndex, field, value) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) => {
          if (idx === itemIndex) {
            const numericValue = parseFloat(value) || 0;
            const updatedItem = { ...item, [field]: numericValue };
            updatedItem.totalToReceive = updatedItem.valuePerUnitCollect * updatedItem.quantity;
            updatedItem.totalValueToPay = updatedItem.valuePerUnitCollect * updatedItem.quantity;
            return updatedItem;
          }
          return item;
        });
        return { ...collect, itens: updatedItens };
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleApprove = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Aprovado' } : item
        );
        return { ...collect, itens: updatedItens, status: true };
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleReject = (collectId, itemIndex) => {
    const updatedData = tableData.map(collect => {
      if (collect.idCollect === collectId) {
        const updatedItens = collect.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Reprovado' } : item
        );
        return { ...collect, itens: updatedItens, status: false };
      }
      return collect;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  return (
    <div className="collect-table-container">
      <table className="collect-table">
        <thead>
          <tr>
            <th className="col-motoboy">Motoboy</th>
            <th className="col-date">Data</th>
            <th className="col-client">Cliente/Endereço</th>
            <th className="col-type">Tipo de Coleta</th>
            <th className="col-quantity">Quantidade</th>
            <th className="col-unit-value">R$ por Unidade</th>
            <th className="col-total-receive">R$ Total a Receber</th>
            <th className="col-status">Status</th>
            <th className="col-actions">Ações</th>
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
                        <td rowSpan={rowSpanCount} className="col-motoboy">{group.collectUser}</td>
                        <td rowSpan={rowSpanCount} className="col-date">{formatDate(group.date)}</td>
                        <td rowSpan={rowSpanCount} className="col-client">{group.edressDescription}</td>
                      </>
                    ) : null}
                    <td className="col-type">{item.collectType}</td>
                    <td className="col-quantity">
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleChange(collect.idCollect, itemIndex, 'quantity', e.target.value)}
                          type="number"
                          inputProps={{ step: '1' }}
                          sx={{ width: '100%' }}
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="col-unit-value">
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.valuePerUnitCollect}
                          onChange={(e) => handleChange(collect.idCollect, itemIndex, 'valuePerUnitCollect', e.target.value)}
                          type="number"
                          inputProps={{ step: '0.01' }}
                          sx={{ width: '100%' }}
                        />
                      ) : (
                        formatCurrency(item.valuePerUnitCollect)
                      )}
                    </td>
                    <td className="col-total-receive">{formatCurrency(item.totalToReceive)}</td>
                    <td className="col-status">{item.deliveryStatus ?? '-'}</td>
                    <td className="col-actions">
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