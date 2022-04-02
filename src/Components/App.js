import { useEffect, useState } from 'react';
import '../Css/App.css';
import TableView from './TableView';

function App() {
  const INTRA_DAY_TRADE_HISTORY_API = process.env.REACT_APP_INTRA_DAY_TRADE_HISTORY_API;

  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    fetchData().then(data => processData(data));
  }, [])

  async function fetchData() {
    const date = new Date();
    const today = date.toJSON().slice(0, 10);
    let url = INTRA_DAY_TRADE_HISTORY_API;
    url = url.replace("{0}", today);
    url = url.replace("{1}", today);

    //API has Access-Control-Allow-Origin policy, I have used a proxy server to overcome cors mode limitations
    url = "https://thingproxy.freeboard.io/fetch/" + url

    let response = await fetch(url).then(r => r.json()).catch(e => console.warn(e));
    return response.body.intraDayTradeHistoryList;
  }

  function processData(data) {
    let resultObject = {};
    let resultList = [];

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element.conract.includes("PB")) {
        continue;
      }

      if (!resultObject[element.conract]) {
        let yy = element.conract.substring(2, 4);
        let mm = element.conract.substring(4, 6);
        let dd = element.conract.substring(6, 8);
        let hh = element.conract.substring(8, 10);
        let date = dd + "." + mm + ".20" + yy + " " + hh + ":00"
        resultObject[element.conract] = {
          "Tarih": date,
          "Toplam İşlem Miktarı (MWh)": 0,
          "Toplam İşlem tuatrı (TL)": 0,
          "Ağırlık Ortalama Fiyat (TL/MWh)": 0
        };
      }

      resultObject[element.conract]["Toplam İşlem tuatrı (TL)"] += (element.price * element.quantity) / 10;
      resultObject[element.conract]["Toplam İşlem Miktarı (MWh)"] += element.quantity / 10;
    }

    Object.keys(resultObject).forEach(key => {
      let element = resultObject[key];
      element["Ağırlık Ortalama Fiyat (TL/MWh)"] = (element["Toplam İşlem tuatrı (TL)"] / element["Toplam İşlem Miktarı (MWh)"]).toFixed(2);
      element["Toplam İşlem tuatrı (TL)"] = element["Toplam İşlem tuatrı (TL)"].toFixed(2);
      element["Toplam İşlem Miktarı (MWh)"] = element["Toplam İşlem Miktarı (MWh)"].toFixed(2);
      resultList.push(element);
    });

    resultList.sort(sortByDate);
    setTableData(resultList)
  }

  function sortByDate(a, b) {
    let dateA = new Date(a["Tarih"]);
    let dateB = new Date(b["Tarih"]);
    return dateA - dateB;
  }

  return (
    <>
      <p className="text-center fs-2 mt-1 mb-3">Today's Trade History</p>
      {tableData && <TableView content={tableData}></TableView>}
    </>
  );
}

export default App;
