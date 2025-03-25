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
    setTableData(data); // Sincroniza tableData com data sempre que data mudar
  }, [data]);

  const groupedData = tableData.reduce((acc, delivery) => {
    const key = `${delivery.date}-${delivery.nameMotoboy}-${delivery.nameCoordinator || 'sem-coordenador'}-${delivery.deliveryRegion}`;
    if (!acc[key]) {
      acc[key] = {
        date: delivery.date,
        deliveryUser: delivery.nameMotoboy,
        coordinator: delivery.nameCoordinator,
        edressDescription: delivery.deliveryRegion, // Usa apenas deliveryRegion
        deliveries: [],
      };
    }
    acc[key].deliveries.push(delivery);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEdit = (deliveryId) => {
    setEditRow(deliveryId);
  };

  const handleSave = (deliveryId) => {
    setEditRow(null);
    onDataChange(tableData);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (deliveryId, field, value) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const numericValue = field === 'value' ? parseFloat(value) || 0 : value;
        return { ...delivery, [field]: numericValue };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleApprove = (deliveryId) => {
    const updatedData = tableData.map(delivery =>
      delivery.idDelivery === deliveryId
        ? { ...delivery, deliveryStatus: 'Aprovado', status: true }
        : delivery
    );
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleReject = (deliveryId) => {
    const updatedData = tableData.map(delivery =>
      delivery.idDelivery === deliveryId
        ? { ...delivery, deliveryStatus: 'Reprovado', status: false }
        : delivery
    );
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
            <th className="col-coordinator">Coordenador</th>
            <th className="col-client">Região</th>
            <th className="col-unit-value">R$ Valor</th>
            <th className="col-status">Status</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => {
            const rowSpanCount = group.deliveries.length;

            return group.deliveries.map((delivery, deliveryIndex) => {
              const rowKey = delivery.idDelivery;
              const isEditing = editRow === rowKey;
              const isApproved = delivery.deliveryStatus === 'Aprovado';
              const isRejected = delivery.deliveryStatus === 'Reprovado';

              return (
                <tr key={rowKey} className={`data-row ${isEditing ? 'editing' : ''}`}>
                  {deliveryIndex === 0 ? (
                    <>
                      <td rowSpan={rowSpanCount} className="col-date">{formatDate(group.date)}</td>
                      <td rowSpan={rowSpanCount} className="col-motoboy">{group.deliveryUser}</td>
                      <td rowSpan={rowSpanCount} className="col-coordinator">
                        {group.coordinator || '-'}
                      </td>
                      <td rowSpan={rowSpanCount} className="col-client">{group.edressDescription || '-'}</td>
                    </>
                  ) : null}
                  <td className="col-unit-value">
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={delivery.value}
                        onChange={(e) => handleChange(delivery.idDelivery, 'value', e.target.value)}
                        type="number"
                        inputProps={{ step: '0.01' }}
                        sx={{ width: '100%' }}
                      />
                    ) : (
                      formatCurrency(delivery.value)
                    )}
                  </td>
                  <td className="col-status">{delivery.deliveryStatus ?? '-'}</td>
                  <td className="col-actions">
                    {isEditing ? (
                      <IconButton onClick={() => handleSave(delivery.idDelivery)} color="primary">
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleApprove(delivery.idDelivery)}
                          color={isApproved ? 'success' : 'default'}
                          sx={{ color: isApproved ? undefined : '#bdbdbd' }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleReject(delivery.idDelivery)}
                          color={isRejected ? 'error' : 'default'}
                          sx={{ color: isRejected ? undefined : '#bdbdbd' }}
                        >
                          <CancelIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(delivery.idDelivery)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;