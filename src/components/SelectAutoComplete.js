 import React, { useState, useEffect } from 'react';
 import { Autocomplete, TextField, CircularProgress } from '@mui/material';
 import api from '../api/api.js';
 
 const SelectAutoComplete = ({
   label,
   route,
   idField = 'id',
   labelField = 'name',
   name,
   value,
   onChange,
   disabled,
   required,
   submitted,
   invalidFields,
   externalLoading,
 }) => {
   const [options, setOptions] = useState([]);
   const [loading, setLoading] = useState(false);
   const [inputValue, setInputValue] = useState('');
 
   useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       try {
         const response = await api.get(route);
         const validOptions = response.data.map(item => ({
           id: item[idField],
           label: item[labelField]
         }));
         setOptions(validOptions);
       } catch (error) {
         console.error(`Erro ao carregar ${route}:`, error);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, [route, idField, labelField]);
 
   const isInvalid = submitted && required && !value && invalidFields?.includes(name);
 
   return (
     <Autocomplete
       options={options}
       getOptionLabel={(option) => option.label || ''}
       loading={loading || externalLoading}
       inputValue={inputValue}
       onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
       onChange={(event, newValue) => onChange({
         target: {
           name,
           value: newValue ? newValue.id : '',
           selectedOption: newValue,
         }
       })}
       disabled={disabled}
       fullWidth
       renderInput={(params) => (
         <TextField
           {...params}
           label={label}
           size="small"
           margin="normal"
           error={isInvalid}
           helperText={isInvalid ? 'Campo obrigatório' : ''}
           InputProps={{
             ...params.InputProps,
             endAdornment: (
               <>
                 {(loading || externalLoading) && <CircularProgress color="inherit" size={20} />}
                 {params.InputProps.endAdornment}
               </>
             ),
           }}
         />
       )}
     />
   );
 };
 
 export default SelectAutoComplete;