import React, { useState, useEffect } from 'react';
import '../../styles/DeliveryTable.css';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const DeliveryTable = ({ data, onDataChange }) => {
  const [tableData, setTableData] = useState(data);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const groupedData = tableData.reduce((acc, delivery) => {
    const key = `${delivery.date}-${delivery.edressDescription}-${delivery.deliveryUser}`;
    if (!acc[key]) {
      acc[key] = {
        date: delivery.date,
        edressDescription: delivery.edressDescription,
        deliveryUser: delivery.deliveryUser,
        deliverys: [],
      };
    }
    acc[key].deliverys.push(delivery);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEdit = (deliveryId, itemIndex) => {
    setEditRow(`${deliveryId}-${itemIndex}`);
  };

  const handleSave = (deliveryId, itemIndex) => {
    setEditRow(null);
    onDataChange(tableData);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (deliveryId, itemIndex, field, value) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItens = delivery.itens.map((item, idx) => {
          if (idx === itemIndex) {
            const numericValue = parseFloat(value) || 0;
            const updatedItem = { ...item, [field]: numericValue };
            return updatedItem;
          }
          return item;
        });
        return { ...delivery, itens: updatedItens };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleApprove = (deliveryId, itemIndex) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItens = delivery.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Aprovado' } : item
        );
        return { ...delivery, itens: updatedItens, status: true };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleReject = (deliveryId, itemIndex) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItens = delivery.itens.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Reprovado' } : item
        );
        return { ...delivery, itens: updatedItens, status: false };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  return (
    <div className="delivery-table-container">
      <table className="delivery-table">
        <thead>
          <tr>
            <th className="col-date">Data</th>
            <th className="col-motoboy">Motoboy</th>
            <th className="col-motoboy">Supervisor</th>
            <th className="col-client">Zona</th>
            <th className="col-total-receive">R$ Valor</th>
            <th className="col-status">Status</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => {
            let rowSpanCount = 0;
            group.deliverys.forEach(delivery => {
              rowSpanCount += delivery.itens.length;
            });

            return group.deliverys.map((delivery, deliveryIndex) =>
              delivery.itens.map((item, itemIndex) => {
                const rowKey = `${delivery.idDelivery}-${itemIndex}`;
                const isEditing = editRow === rowKey;
                const isApproved = item.deliveryStatus === 'Aprovado';
                const isRejected = item.deliveryStatus === 'Reprovado';

                return (
                  <tr key={rowKey} className={`data-row ${isEditing ? 'editing' : ''}`}>
                    {deliveryIndex === 0 && itemIndex === 0 ? (
                      <>
                        <td rowSpan={rowSpanCount} className="col-motoboy">{group.deliveryUser}</td>
                        <td rowSpan={rowSpanCount} className="col-date">{formatDate(group.date)}</td>
                        <td rowSpan={rowSpanCount} className="col-client">{group.edressDescription}</td>
                      </>
                    ) : null}
                    <td className="col-type">{item.deliveryType}</td>
                    <td className="col-quantity">
                      {isEditing ? (
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleChange(delivery.idDelivery, itemIndex, 'quantity', e.target.value)}
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
                          value={item.valuePerUnitDelivery}
                          onChange={(e) => handleChange(delivery.idDelivery, itemIndex, 'valuePerUnitDelivery', e.target.value)}
                          type="number"
                          inputProps={{ step: '0.01' }}
                          sx={{ width: '100%' }}
                        />
                      ) : (
                        formatCurrency(item.valuePerUnitDelivery)
                      )}
                    </td>
                    <td className="col-total-receive">{formatCurrency(item.totalToReceive)}</td>
                    <td className="col-status">{item.deliveryStatus ?? '-'}</td>
                    <td className="col-actions">
                      {isEditing ? (
                        <IconButton onClick={() => handleSave(delivery.idDelivery, itemIndex)} color="primary">
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => handleApprove(delivery.idDelivery, itemIndex)}
                            color={isApproved ? 'success' : 'default'}
                            sx={{ color: isApproved ? undefined : '#bdbdbd' }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleReject(delivery.idDelivery, itemIndex)}
                            color={isRejected ? 'error' : 'default'}
                            sx={{ color: isRejected ? undefined : '#bdbdbd' }}
                          >
                            <CancelIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEdit(delivery.idDelivery, itemIndex)} color="primary">
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

export default DeliveryTable;