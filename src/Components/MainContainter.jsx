import React, { useEffect, useState } from "react";
// import Card from './Card';

const MainContainter = () => {
  const [smallCasesData, setSmallCasesData] = useState([]);
  const [status, setStatus] = useState({
    subscriptionType: "Show All",
    investAmountTpe: "All",
    voltalityType: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("public/smallcases.json");
        let fetchedData = await response.json();
        setSmallCasesData(fetchedData.data);
      } catch (err) {
        console.log("Unable to fetch data: " + err);
      }
    }
    fetchData();
  }, []);

  function handleSubscriptionType(subscriptionType) {
    setStatus({
      ...status,
      subscriptionType: subscriptionType,
    });
  }

  function handleInvestmentAmountFilter(investAmountTpe) {
    setStatus({
      ...status,
      investAmountTpe: investAmountTpe,
    });
  }

  function handleVoltality(voltalityType) {
    setStatus({
      ...status,
      voltalityType: voltalityType,
    });
  }

  let filteredSmallCasesData = getFilteredSmallCasesData(
    status,
    smallCasesData
  );

  return (
    <>
     <div>{filteredSmallCasesData.length}</div>
      <div className="flex justify-center gap-4">
        <aside className=" flex flex-col gap-2 min-w-[300px] border p-2">
          <SideBar
            handleSubscriptionType={handleSubscriptionType}
            handleInvestmentAmountFilter={handleInvestmentAmountFilter}
            handleVoltality={handleVoltality}
          />
        </aside>
        <ul>
         
          {filteredSmallCasesData.map((ele, index) => {
            return <Card ele={ele} key={ele._id} />;
          })}
        </ul>
      </div>
    </>
  );
};

function Card({ ele }) {
  let subscriptionTypeIsPrivate = ele.flags.private;
  let heading = ele.info.name.substring(0, 20) + "...";
  let imageLink =
    "https://assets.smallcase.com/images/smallcases/160/" + ele.scid + ".png";

  return (
    <div className="flex  border-b border-b-gray-300    w-[900px] gap-4 p-6">
      <img src={imageLink} alt="" className="h-[80px] flex-1/10" />
      <div className="info flex-5/10 flex flex-col gap-2">
        <header className="text-xl font-bold">
          {heading}
          {!subscriptionTypeIsPrivate && (
            <span className="ml-2 px-2 rounded text-[10px]  text-blue-400 border border-gray-300">
              Free Access{" "}
            </span>
          )}
        </header>
        <p className="text-justify">{ele.info.shortDescription}</p>
        <p className="text-[#8f9399] ">{ele.info.publisherName} </p>
      </div>
      <div className="amount flex flex-col justify-center items-center flex-1/10">
        <span className="text-[#8f9399] ">Min.Amount</span>
        <span>{ele.stats.minInvestAmount}</span>
      </div>
      <div className="catagire flex flex-col justify-center items-center flex-1/10 ">
        <span className="text-[#8f9399] ">
          {ele.stats.ratios.cagrDuration} CAGR
        </span>
        <span className="text-green-500">
          {(ele.stats.ratios.cagr * 100).toFixed(2)}%
        </span>
      </div>

      <div
        className={`text-red-500   flex justify-center items-center flex-2/10 `}
      >
        <span className=" border border-gray-300 px-4 py-0.5 rounded-md">
          {ele.stats.ratios.riskLabel}
        </span>
      </div>
    </div>
  );
}

function SideBar({
  handleSubscriptionType,
  handleInvestmentAmountFilter,
  handleVoltality,
}) {
  return (
    <>
      <p className="text-xl font-bold  ">Subscription Type</p>
      <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
        {["Show All", "Free Access", "Fee Based"].map((ele) => {
          return (
            <li
              key={ele}
              onClick={() => handleSubscriptionType(ele)}
              className={`p-2`}
            >
              {ele}
            </li>
          );
        })}
      </ul>
      <div className="investmentAmount">
        <p className=" text-xl font-bold "> Investment Amount</p>
        <ul className="flex flex-col gap-4">
          {["All", "Under ₹ 5000", "Under ₹ 25000", "Under ₹ 50000"].map(
            (ele) => {
              return (
                <li key={ele}>
                  <input
                    type="radio"
                    name="radio-1"
                    className="radio"
                    onClick={() => handleInvestmentAmountFilter(ele)}
                  />{" "}
                  <span className="pl-2">{ele}</span>
                </li>
              );
            }
          )}
        </ul>
      </div>
      <div className="Voltality ">
        <p className=" text-xl font-bold ">Voltality</p>
        <ul className="flex mt-4">
          {["Low", "Medium", "High"].map((ele) => {
            return (
              <li key={ele}>
                <button
                  className={`p-2 border`}
                  onClick={() => {
                    handleVoltality(ele);
                  }}
                >
                  {ele}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function getFilteredSmallCasesData(status,data) {
  let filterdData = [];
  let voltalityType=status.voltalityType;
  let subscriptionType=status.subscriptionType;
  let investAmountTpe=status.investAmountTpe;


  if (subscriptionType == "Free Access") {
    filterdData = data.filter((ele) => {
      let subscriptionTypeIsPrivate = ele.flags.private;
      return !subscriptionTypeIsPrivate;
    });
  } else if (subscriptionType == "Fee Based") {
    filterdData = data.filter((ele) => {
      let subscriptionTypeIsPrivate = ele.flags.private;
      return subscriptionTypeIsPrivate;
    });
  } else if (subscriptionType == "Show All") {
    filterdData = data.map((ele) => ele);
  }


  if (investAmountTpe == "Under ₹ 5000") {
    filterdData = filterdData.filter((ele) => {
      let minInvestAmount = parseFloat(ele.stats.minInvestAmount);
      return minInvestAmount <= 5000;
    });
  } else if (investAmountTpe == "Under ₹ 25000") {
    filterdData = filterdData.filter((ele) => {
      let minInvestAmount = parseFloat(ele.stats.minInvestAmount);
      return minInvestAmount <= 25000;
    });
  } else if (investAmountTpe == "Under ₹ 50000") {
    filterdData = filterdData.filter((ele) => {
      let minInvestAmount = parseFloat(ele.stats.minInvestAmount);
      return minInvestAmount <= 50000;
    });
  } else if (investAmountTpe == "All") {
    filterdData = filterdData.map((ele) => ele);
  }

  
  if(voltalityType=='Low'){
    filterdData = filterdData.filter((ele) => {
      let volatility = ele.stats.ratios.riskLabel;
      return volatility =='Low Volatility';
    });

  }
  else   if(voltalityType=='Medium'){
    filterdData = filterdData.filter((ele) => {
      let volatility = ele.stats.ratios.riskLabel;
      return volatility =='Medium Volatility';
    });

  }
  else   if(voltalityType=='High'){
    filterdData = filterdData.filter((ele) => {
      let volatility = ele.stats.ratios.riskLabel;
      return volatility =='High Volatility';
    });

  }



  return filterdData;
}

export default MainContainter;
