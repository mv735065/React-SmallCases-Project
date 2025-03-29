import React from 'react'
// e9f0fc bg-light-blue
import CagReturns from './CagReturns';

function Card({ ele ,status,sortByOptions,sortByTimePeriodOptions}) {
  let subscriptionTypeIsPrivate = ele.flags.private;
  let heading = ele.info.name.substring(0, 20) + "...";
  let imageLink =
    "https://assets.smallcase.com/images/smallcases/160/" + ele.scid + ".png";
 let label=ele.stats.ratios.riskLabel;


      
  let cagrProps= {ele ,status,sortByOptions,sortByTimePeriodOptions}
     

  return (
    <div className="flex  border-b border-b-gray-300    gap-4 py-4">
      <img src={imageLink} alt="" className="h-[70px]  w-[70px] ml-2" />
      <div className="info flex-4/10 flex flex-col gap-2">
        <header className="text-xl font-bold">
          {heading}
          {!subscriptionTypeIsPrivate && (
            <span className="ml-2 px-2 rounded text-[10px]  text-blue-400 border border-gray-300">
              Free Access{" "}
            </span>
          )}
        </header>
        <p className="text-sm">{ele.info.shortDescription}</p>
        <p className="text-[#8f9399] text-sm">{ele.info.publisherName} </p>
      </div>
      <div className="amount flex flex-col justify-center items-center flex-1/10">
        <span className="text-[#8f9399] ">Min.Amount</span>
        <span className='font-medium'>₹{ele.stats.minInvestAmount}</span>
      </div>
      <CagReturns {...cagrProps}/>
      
      <div
        className={` text-sm font-medium  flex justify-center items-center flex-2/10 `}
      >
        <span className=" border border-gray-300 px-2 py-1 rounded-md flex flex-row items-center">
          {label.split(" ")[0].trim()=='Low' && <img src="src/assets/1.png"/>}
          {label.split(" ")[0].trim()=='Medium' && <img src="src/assets/2.png"/>}
          {label.split(" ")[0].trim()=='High' && <img src="src/assets/3.png"/>}

          {label.split(" ")[0].trim()=='Medium' ? 'Med. Volatility' : label}
        </span>
      </div>
    </div>
  );
}

export default Card