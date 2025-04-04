import React, { useState, useEffect } from 'react';
import '../../styles/DeliveryTable.css';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const DeliveryTable = ({ data, onDataChange }) => {
  const [tableData, setTableData] = useState(data || []);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const groupedData = tableData.reduce((acc, delivery) => {
    const key = `${delivery.date}-${delivery.nameMotoboy}-${delivery.nameCoordinator || 'sem-coordenador'}-${delivery.deliveryRegion}`;
    if (!acc[key]) {
      acc[key] = {
        date: delivery.date,
        deliveryUser: delivery.nameMotoboy,
        coordinator: delivery.nameCoordinator,
        edressDescription: delivery.deliveryRegion,
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const calculateDeliveryValue = (items) => {
    return items.reduce((sum, item) => {
      if (item.deliveryStatus !== 'Aprovado') return sum; // Considera apenas itens aprovados
      const quantity = parseFloat(item.quantity) || 0;
      const valuePerUnit = parseFloat(item.valuePerUnitDelivery) || 0;
      return sum + quantity * valuePerUnit;
    }, 0);
  };

  const handleEdit = (deliveryId, itemIndex) => {
    setEditRow(`${deliveryId}-${itemIndex}`);
  };

  const handleSave = (deliveryId, itemIndex) => {
    setEditRow(null);
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        return { ...delivery, value: calculateDeliveryValue(delivery.deliveryItemDTO) };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleChange = (deliveryId, itemIndex, field, value) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItems = delivery.deliveryItemDTO.map((item, idx) => {
          if (idx === itemIndex) {
            const numericValue = (field === 'quantity' || field === 'valuePerUnitDelivery') 
              ? parseFloat(value) || 0 
              : value;
            const updatedItem = { ...item, [field]: numericValue };
            updatedItem.totalToPay = updatedItem.quantity * updatedItem.valuePerUnitDelivery;
            return updatedItem;
          }
          return item;
        });
        return { ...delivery, deliveryItemDTO: updatedItems, value: calculateDeliveryValue(updatedItems) };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleApprove = (deliveryId, itemIndex) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItems = delivery.deliveryItemDTO.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Aprovado' } : item
        );
        return { ...delivery, deliveryItemDTO: updatedItems, value: calculateDeliveryValue(updatedItems) };
      }
      return delivery;
    });
    setTableData(updatedData);
    onDataChange(updatedData);
  };

  const handleReject = (deliveryId, itemIndex) => {
    const updatedData = tableData.map(delivery => {
      if (delivery.idDelivery === deliveryId) {
        const updatedItems = delivery.deliveryItemDTO.map((item, idx) =>
          idx === itemIndex ? { ...item, deliveryStatus: 'Reprovado' } : item
        );
        return { ...delivery, deliveryItemDTO: updatedItems, value: calculateDeliveryValue(updatedItems) };
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
            <th className="col-coordinator">Coordenador</th>
            <th className="col-client">Região</th>
            <th className="col-type">Tipo de Entrega</th>
            <th className="col-quantity">Quantidade</th>
            <th className="col-unit-value">R$ Unidade</th>
            <th className="col-total-to-pay">R$ Total Item</th>
            <th className="col-status">Status</th>
            <th className="col-total-value">R$ Valor</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => {
            let rowSpanCount = 0;
            group.deliveries.forEach(delivery => {
              rowSpanCount += delivery.deliveryItemDTO.length || 1;
            });

            return group.deliveries.map((delivery, deliveryIndex) =>
              delivery.deliveryItemDTO.length > 0 ? (
                delivery.deliveryItemDTO.map((item, itemIndex) => {
                  const rowKey = `${delivery.idDelivery}-${itemIndex}`;
                  const isEditing = editRow === rowKey;
                  const isApproved = item.deliveryStatus === 'Aprovado';
                  const isRejected = item.deliveryStatus === 'Reprovado';

                  return (
                    <tr key={rowKey} className={`data-row ${isEditing ? 'editing' : ''}`}>
                      {deliveryIndex === 0 && itemIndex === 0 ? (
                        <>
                          <td rowSpan={rowSpanCount} className="col-date">{formatDate(group.date)}</td>
                          <td rowSpan={rowSpanCount} className="col-motoboy">{group.deliveryUser}</td>
                          <td rowSpan={rowSpanCount} className="col-coordinator">
                            {group.coordinator || '-'}
                          </td>
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
                            inputProps={{ step: '1', min: 1 }}
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
                            inputProps={{ step: '0.01', min: 0 }}
                            sx={{ width: '100%' }}
                          />
                        ) : (
                          formatCurrency(item.valuePerUnitDelivery)
                        )}
                      </td>
                      <td className="col-total-to-pay">{formatCurrency(item.quantity * item.valuePerUnitDelivery)}</td>
                      <td className="col-status">{item.deliveryStatus ?? '-'}</td>
                      {itemIndex === 0 ? (
                        <td rowSpan={delivery.deliveryItemDTO.length} className="col-total-value">
                          {formatCurrency(delivery.value)}
                        </td>
                      ) : null}
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
              ) : (
                <tr key={delivery.idDelivery}>
                  {deliveryIndex === 0 ? (
                    <>
                      <td rowSpan={rowSpanCount} className="col-date">{formatDate(group.date)}</td>
                      <td rowSpan={rowSpanCount} className="col-motoboy">{group.deliveryUser}</td>
                      <td rowSpan={rowSpanCount} className="col-coordinator">{group.coordinator || '-'}</td>
                      <td rowSpan={rowSpanCount} className="col-client">{group.edressDescription}</td>
                    </>
                  ) : null}
                  <td className="col-type">-</td>
                  <td className="col-quantity">-</td>
                  <td className="col-unit-value">-</td>
                  <td className="col-total-to-pay">-</td>
                  <td className="col-status">{delivery.deliveryStatus ?? '-'}</td>
                  <td className="col-total-value">{formatCurrency(delivery.value)}</td>
                  <td className="col-actions">
                    <IconButton
                      onClick={() => handleApprove(delivery.idDelivery, null)}
                      color={delivery.deliveryStatus === 'Aprovado' ? 'success' : 'default'}
                      sx={{ color: delivery.deliveryStatus === 'Aprovado' ? undefined : '#bdbdbd' }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleReject(delivery.idDelivery, null)}
                      color={delivery.deliveryStatus === 'Reprovado' ? 'error' : 'default'}
                      sx={{ color: delivery.deliveryStatus === 'Reprovado' ? undefined : '#bdbdbd' }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;