import React, { useState, useEffect } from 'react';
import '../../styles/AddressTable.css';
import { IconButton, TextField, Select, MenuItem, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const AddressTable = ({ data = [], onDataChange }) => {
  const [tableData, setTableData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [initialData, setInitialData] = useState(null); 

  const flattenData = (apiData) => {
    return apiData.flatMap((address, index) => {
      if (!address.collectPreValue || address.collectPreValue.length === 0) {
        return [{
          idEdress: address.idEdress,
          description: address.description,
          edress: address.edress,
          status: address.status,
          collectType: '-',
          preValue: null,
          idCollectPreValue: `empty-${address.idEdress}-${index}`,
        }];
      }
      return address.collectPreValue.map(cpv => ({
        idEdress: address.idEdress,
        description: address.description,
        edress: address.edress,
        status: address.status,
        idCollectType: cpv.idCollectType,
        collectType: cpv.collectType,
        preValue: cpv.preValue,
        idCollectPreValue: cpv.idCollectPreValue,
      }));
    });
  };

  useEffect(() => {
    if (!initialData || JSON.stringify(data) !== JSON.stringify(initialData)) {
      const flattenedData = flattenData(data);
      setTableData((prevData) => prevData.length > 0 ? prevData : flattenedData);
      setInitialData(data);
    }
  }, [data]);  

  const groupedData = tableData.reduce((acc, address) => {
    const key = `${address.idEdress}-${address.description}-${address.edress}-${address.status}`;
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
    setTableData(updatedData); // Atualiza estado local
    
    if (typeof onDataChange === 'function') {
      onDataChange(updatedData); // Atualiza Redux
    }
  };

  const handleChange = (idCollectPreValue, field, value) => {
    const updatedData = tableData.map(address => {
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
                              onChange={(e) => handleChange(address.idCollectPreValue, 'status', e.target.value)}
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