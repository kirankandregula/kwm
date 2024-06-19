import { useCallback, useEffect } from "react";
import axios from "axios";

export const useFetchData = (
  setFinancialData,
  setStockData,
  setIndividualStockData,
  setStockInRadarData,
  setEtfServiceData,
  setHistoryData,
  setLoading
) => {
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        financialResponse,
        stockResponse,
        individualStockResponse,
        stockInRadarResponse,
        etfServiceResponse,
        historyResponse
      ] = await Promise.all([
        axios.get(
          "https://script.google.com/macros/s/AKfycby5GfxI1JMefqrVXYHMaodj07Dbx1MOTY8O_gu1U14ceiqdZzbN42ZX9KCmi_J0ZJJL/exec"
        ),
        axios.get(
          "https://script.googleusercontent.com/macros/echo?user_content_key=697rrLjwFYb7dZdxmz2WtAK0v7TSdy_D-aQmRL37y1N41_jSxXQRfQ-mNHnJcfFAr-L-FKjj2r5kFAsBYKPkbO6jqPx4ghSfm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDZ1xou3Yh4_OfOhrnVFN_l_7UgENfxTtMYqWp-LqOc5fnHnWUGSpRLqjn72R3VFhw9KRDVeiat-iXRlSyZY22LMiOySTcSiOg&lib=MDgztCdXOLOYDH2WnKkUSaorbG83cRkUz"
        ),
        axios.get(
          "https://script.google.com/macros/s/AKfycbxj-Dbrcp_6oP_7wsiNaITfKkIvzqYTGi6J60N0L9mc7XFGBG7aK7QKELcZOlvh2z8R/exec"
        ),
        axios.get(
          "https://script.google.com/macros/s/AKfycbwehBgEFgQRRKfiB6yzSRTXzkeQK27OLEg65H1XX_Hiqp2ClxjmakhYyNi9PYPG_CemgQ/exec"
        ),
        axios.get(
          "https://script.google.com/macros/s/AKfycbyAGkiTm2CCB56gtwdO2EpHhNb75gnogCedBoF3tnsR6mcfjY5LwpDEaDUS7mH0F4a3Xg/exec"
        ),
        axios.get(
          "https://script.google.com/macros/s/AKfycbwLPbCIhhasSg3AD6KZwQQ6ituKUc1CA04cpmk201tmDQUXGBz5RoHKlmW_a7HE1oabCQ/exec"
        ),
      ]);

      setFinancialData(financialResponse.data);
      setStockData(stockResponse.data);
      setIndividualStockData(individualStockResponse.data);
      setStockInRadarData(stockInRadarResponse.data);
      setEtfServiceData(etfServiceResponse.data);
      setHistoryData(historyResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    setFinancialData,
    setStockData,
    setIndividualStockData,
    setStockInRadarData,
    setEtfServiceData,
    setHistoryData,
    setLoading,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return fetchData function to be used outside of this hook
  return fetchData;
};
