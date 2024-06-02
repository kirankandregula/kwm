import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [individualStockData, setIndividualStockData] = useState([]);
  const [stockInRadarData, setStockInRadarData] = useState([]);
  const [stockMonitorData, setStockMonitorData] = useState([]);
  const [etfServiceData, setEtfServiceData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        financialResponse,
        stockResponse,
        individualStockResponse,
        stockInRadarResponse,
        stockMonitorResponse,
        etfServiceData,
      ] = await Promise.all([
        axios.get(
          "https://script.google.com/macros/s/AKfycbymorTjnVzmJr56gY5zoBlD-dUp8bwC-dYwIKdAm2WRjnfpwjgMLpUut9E15rgCbXah/exec"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=M8iUr2Z4ujhnZj3gV3jqyikffgyvfGGgE3LB3d7khmmrPclpYpwHDJT4UsbuwsGWdk_NjhcYGkEiZFHb0g2ZI4og0-Tok6FKm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=qMtoCMo4kWltfUjYaRn6GopWqqNndEC1bezXUgK8M0LeH5jWm4drHpNHHELMyw7si7YwnvME1t3xMbELX7VJ_sn8N9MXtc1Jm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPqU_W-BE9pyJ8Qi7blHIc0Q4hbO2tLSd-Ckxc38EV02_Qf-RqQCqPnZjz_HV7aw1twIbDb-TFUbhpkZ24DVnzhFvnZ3JX3SHg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=sWCqu1QFJ5Q66c1GGYLcUlsDZ6saLTQZhHqE9HK-f2L__qCglxC6dFGy6LU-wl6FftvL3ZnHCYzGsz899pWZoZIBSb7jeHCCm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF8p6Pvu3GCIvWI3y7Ghdmj_6hTbf1zJNLytKYjKWeR9NiP1GwU0UtbxfLZwjkztxGbJ7F4B_nj2Vjvl4XSHwi4AYsHa6a3vbA&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=vD551i3Sl968rHYmG6gvgVXw_sX9uuSAG7JSqMsfVqTmAT-3Mj2AAXHDwADO_pZR7rfgES0w1KZYhPKLqmjkxiN1MdZer5WWm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJUuS5kFw4GS3DGrfDRKK1IUOKbOdT5AGFGWi--yGq4tCHbBYarsDWq-dJ_z5hlblCf7zaPtBDNU_v8miqX3Xhx2Q_wVdJA9lQ&lib=MB2EvUQOnusAtbHEY3orlAmtjq-h6POhb"
        ),
      ]);

      setFinancialData(financialResponse.data);
      setStockData(stockResponse.data);
      setIndividualStockData(individualStockResponse.data);
      setStockInRadarData(stockInRadarResponse.data);
      setStockMonitorData(stockMonitorResponse.data);
      setEtfServiceData(etfServiceData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider
      value={{
        financialData,
        stockData,
        individualStockData,
        stockInRadarData,
        stockMonitorData,
        etfServiceData,
        loading,
        fetchData, // Expose the fetchData function
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
