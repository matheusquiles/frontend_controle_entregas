import React, { useState, useEffect } from 'react';
import '../../styles/AddressTable.css';
import { IconButton, TextField, Select, MenuItem, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const AddressTable = ({ data = [], onDataChange }) => {
  const [tableData, setTableData] = useState([]);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    setTableData(data); 
  }, [data]);

  const groupedData = tableData.reduce((acc, address) => {
    const key = `${address.idEdress}`;
    if (!acc[key]) {
      acc[key] = {
        idEdress: address.idEdress,
        description: address.description,
        edress: address.edress,
        status: address.status,
        addressItems: [],
      };
    }
    acc[key].addressItems.push(address);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEdit = (idCollectPreValue) => {
    setEditRow(idCollectPreValue);
  };

  const handleSave = (idCollectPreValue) => {
    setEditRow(null);

    const updatedData = [...tableData];
    setTableData(updatedData);

    if (typeof onDataChange === 'function') {
      const grouped = {};

      updatedData.forEach(item => {
        if (!grouped[item.idEdress]) {
          grouped[item.idEdress] = {
            idEdress: item.idEdress,
            description: item.description,
            edress: item.edress,
            status: item.status,
            collectPreValue: [],
          };
        }

        if (item.collectType !== '-') {
          grouped[item.idEdress].collectPreValue.push({
            idCollectPreValue: item.idCollectPreValue,
            idCollectType: item.idCollectType,
            collectType: item.collectType,
            preValue: item.preValue,
          });
        }
      });

      const restoredData = Object.values(grouped);
      onDataChange(restoredData);
    }
  };

  const handleChange = (idCollectPreValue, field, value) => {
    const updatedData = tableData.map(address => {
      const targetAddress = tableData.find(a => a.idCollectPreValue === idCollectPreValue);
      const targetIdEdress = targetAddress.idEdress;

      if (field === 'description' || field === 'edress') {
        if (address.idEdress === targetIdEdress) {
          return { ...address, [field]: value };
        }
      }

      if (address.idCollectPreValue === idCollectPreValue) {
        if (field === 'preValue') {
          return { ...address, [field]: value === '' ? null : parseFloat(value) };
        }
        return { ...address, [field]: value };
      }
      return address;
    });

    setTableData(updatedData);

    if (typeof onDataChange === 'function') {
      onDataChange(updatedData);
    }
  };

  return (
    <div className="address-table-container">
      <table className="address-table">
        <thead>
          <tr>
            <th>ID Endereço</th>
            <th>Descrição</th>
            <th>Endereço</th>
            <th>Status</th>
            <th>Tipo de Coleta</th>
            <th>Valor Prévio</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => {
            const rowSpanCount = group.addressItems.length;

            return group.addressItems.map((address, itemIndex) => {
              const rowKey = `${address.idCollectPreValue}`;
              const isEditing = editRow === address.idCollectPreValue;

              return (
                <tr key={rowKey} className={`data-row ${isEditing ? 'editing' : ''}`}>
                  {itemIndex === 0 ? (
                    <>
                      <td rowSpan={rowSpanCount}>{group.idEdress}</td>
                      <td rowSpan={rowSpanCount}>
                        {isEditing && itemIndex === 0 ? (
                          <TextField
                            size="small"
                            value={address.description}
                            onChange={(e) => handleChange(address.idCollectPreValue, 'description', e.target.value)}
                          />
                        ) : (
                          address.description
                        )}
                      </td>
                      <td rowSpan={rowSpanCount}>
                        {isEditing && itemIndex === 0 ? (
                          <TextField
                            size="small"
                            value={address.edress}
                            onChange={(e) => handleChange(address.idCollectPreValue, 'edress', e.target.value)}
                          />
                        ) : (
                          address.edress
                        )}
                      </td>
                      <td rowSpan={rowSpanCount}>
                        {isEditing && itemIndex === 0 ? (
                          <FormControl size="small">
                            <Select
                              value={address.status ? 'Ativo' : 'Inativo'}
                              onChange={(e) => {
                                const newStatus = e.target.value === 'Ativo' ? true : false;
                                handleChange(address.idCollectPreValue, 'status', newStatus);
                              }}
                            >
                              <MenuItem value="Ativo">Ativo</MenuItem>
                              <MenuItem value="Inativo">Inativo</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          address.status ? 'Ativo' : 'Inativo'
                        )}
                      </td>
                    </>
                  ) : null}
                  <td>{address.collectType}</td>
                  <td>
                    {isEditing && address.collectType !== '-' ? (
                      <TextField
                        size="small"
                        value={address.preValue ?? ''}
                        onChange={(e) => handleChange(address.idCollectPreValue, 'preValue', e.target.value)}
                        type="number"
                        inputProps={{ step: '0.01' }}
                      />
                    ) : (
                      formatCurrency(address.preValue)
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <IconButton onClick={() => handleSave(address.idCollectPreValue)} color="primary">
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(address.idCollectPreValue)} color="primary">
                        <EditIcon />
                      </IconButton>
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

export default AddressTable;