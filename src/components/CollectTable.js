import React from 'react';
import '../styles/CollectTable.css';

const CollectTable = ({ data }) => {
  // Verifica se data é um array antes de usar reduce
  if (!Array.isArray(data)) {
    return <div>Dados inválidos</div>;
  }

  // Group collects by date and edressDescription
  const groupedData = data.reduce((acc, collect) => {
    const key = `${collect.date}-${collect.edressDescription}`;
    if (!acc[key]) {
      acc[key] = {
        date: collect.date,
        edressDescription: collect.edressDescription,
        collects: []
      };
    }
    acc[key].collects.push(collect);
    return acc;
  }, {});

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
            <th>Valor por Unidade</th>
            <th>Valor Total a Receber</th>
            <th>Valor a Pagar por Unidade</th>
            <th>Valor Total a Pagar</th>
            <th>Status da Entrega</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedData).map((group, groupIndex) => (
            group.collects.map((collect, collectIndex) => (
              collect.itens.map((item, itemIndex) => (
                <tr key={`${groupIndex}-${collectIndex}-${itemIndex}`} className="data-row">
                  {collectIndex === 0 && itemIndex === 0 ? (
                    <>
                      <td rowSpan={group.collects.reduce((sum, c) => sum + c.itens.length, 0)}>
                        {collect.collectUser}
                      </td>
                      <td rowSpan={group.collects.reduce((sum, c) => sum + c.itens.length, 0)}>
                        {group.date}
                      </td>
                      <td rowSpan={group.collects.reduce((sum, c) => sum + c.itens.length, 0)}>
                        {group.edressDescription}
                      </td>
                    </>
                  ) : null}
                  <td>{item.collectType}</td>
                  <td>{item.quantity}</td>
                  <td>{item.valuePerUnitCollect ?? '-'}</td>
                  <td>{item.totalToReceive ?? '-'}</td>
                  <td>{item.valueToPayPerUnit ?? '-'}</td>
                  <td>{item.totalValueToPay ?? '-'}</td>
                  <td>{item.deliveryStatus ?? '-'}</td>
                </tr>
              ))
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectTable;