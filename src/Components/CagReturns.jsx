import React from 'react'

const CagReturns = (props) => {
 let {ele ,status,sortByOptions,sortByTimePeriodOptions}=props;


 let sortByType= status.sortByType;
 let isOptionSelectedTimePeriod=!sortByOptions.has(sortByType);
 let timePeriod=isOptionSelectedTimePeriod ? sortByTimePeriodOptions[sortByType]:null;

 let cagrDuration=ele.stats.ratios.cagrDuration+" CAGR";
 let cagrPercentage=(ele.stats.ratios.cagr * 100).toFixed(2);
 let returnsDuration=sortByType+" Returns";
 let returnsPercentange=(ele.stats.returns[timePeriod]*100).toFixed(2);

  return (
    <div className="catagire flex flex-col justify-center items-center flex-1/10 ">
    <span className="text-[#8f9399]  text-sm font-medium">
     {isOptionSelectedTimePeriod ? returnsDuration: cagrDuration}
    </span>
    <span className={`text-green-500 font-medium ${isOptionSelectedTimePeriod && returnsPercentange <0 && 'text-red-500' }`}>
      {isOptionSelectedTimePeriod ? returnsPercentange : cagrPercentage}%
    </span>
  </div>
  )
}

export default CagReturns