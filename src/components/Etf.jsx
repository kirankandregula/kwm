import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/react';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const EtfService = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=vD551i3Sl968rHYmG6gvgVXw_sX9uuSAG7JSqMsfVqTmAT-3Mj2AAXHDwADO_pZR7rfgES0w1KZYhPKLqmjkxiN1MdZer5WWm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJUuS5kFw4GS3DGrfDRKK1IUOKbOdT5AGFGWi--yGq4tCHbBYarsDWq-dJ_z5hlblCf7zaPtBDNU_v8miqX3Xhx2Q_wVdJA9lQ&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = Object.entries(data)
    .filter(([_, details]) => !Object.values(details).every(value => value === 'NA') && details["ETF Name"] !== "")
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="sweet-loading">
          <ClipLoader color={'#36D7B7'} loading={loading} css={override} size={150} />
        </div>
      </div>
    );
  }

  const triggerColumns = Object.keys(filteredData[Object.keys(filteredData)[0]])
    .slice(2)
    .filter(col => Object.values(filteredData).some(details => details[col] === 'TRIGGER'));

  return (
    <div>
     
      <div className="table-responsive " style={{marginTop: "80px",marginBottom: "80px"}}>
        <h2 className='text-success text-center'>ETF Service</h2>
        <table className="table table-bordered table-striped shadow">
          <thead className="bg-primary text-white">
            <tr>
              <th>Stock</th>
              <th>CMP</th>
              {triggerColumns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredData).map(([stock, details]) => (
              <tr key={stock}>
                <td>{details["ETF Name"]}</td>
                <td>{details.CMP}</td>
                {triggerColumns.map(col => (
                  <td key={col} className={details[col] === 'TRIGGER' ? 'text-danger' : ''}>
                    {details[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EtfService;
