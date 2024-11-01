import React from "react";
import { useState ,useEffect } from "react";
import axios from 'axios';
import { VerticalGraph } from "./VerticalGraph";
const Holdings = () => {
  let [holdings,setHoldings] = useState([]);
  let [order,setOrder] = useState([]);
  useEffect(()=>{
    axios.get('http://localhost:8080/allHoldings').then(
      (res)=>{
        setHoldings(res.data);
      }
      
    ) 
    axios.get('http://localhost:8080/allOrder').then((res)=>{
      setOrder(res.data);
    })
  },[])
  const data = {
    labels: holdings.map((stock)=>stock.name),
    datasets: [
      {
        label: "All Holdings",
        data: holdings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  console.log(data)
  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
          {holdings.map((stock,index)=>{
            const currValue = stock.price*stock.qty;
            const isProfit = currValue-stock.avg*stock.qty>=0.0
            const profClass = isProfit ? 'profit' : 'loss';
            const dayClass = stock.isLoss ? 'loss' : 'profit';
            return(
          <tr key={index} >
            <td>{stock.name}</td>
            <td>{stock.qty}</td>
            <td>{stock.avg.toFixed(2)}</td>
            <td>{stock.price.toFixed(2)}</td>
            <td>{currValue.toFixed(2)}</td>
            <td className={profClass}>{(currValue-stock.avg*stock.qty).toFixed(2)}</td>
            <td className={profClass}>{stock.net}</td>
            <td className={dayClass}>{stock.day}</td>
          </tr>
            );
          })}
          {order.map((stock,index)=>{
            const currValue = stock.curr*stock.qty;
            const isProfit = currValue-stock.price;
            const day = isProfit<=0 ? ((currValue-stock.price)/currValue*100) : (stock.price)
            const profClass = isProfit>=1 ? 'profit' : 'loss';
            return(
          <tr key={index} >
            <td>{stock.name}</td>
            <td>{stock.qty}</td>
            <td>{stock.price}</td>
            <td>{stock.curr}</td>
            <td>{currValue.toFixed(2)}</td>
            <td className={profClass}>{(isProfit).toFixed(2)}</td>
            <td className={profClass}>{(day).toFixed(2)}%</td>
            <td className={profClass}>{((stock.curr-stock.price/currValue)/12).toFixed(2)}</td>
          </tr>
            );
          })}
        </table>
      </div>
      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
        <VerticalGraph data={data}/>
    </>
  )
}

export default Holdings;