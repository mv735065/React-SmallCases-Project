import React, { useEffect, useState } from "react";
// import Card from './Card';

const MainContainter = () => {
  const [smallCasesData, setSmallCasesData] = useState([]);
  const [status, setStatus] = useState({
    subscriptionType: "Show All",
    minInvestAmount: "All",
    voltalityType: null,
    investmentStrategySet: new Set(),
    sortByType: "Popularity",
    orderBy:"High-Low"
  });

  let investmentStrategyListAsMap = getListOfInvestmentStrategy(smallCasesData);

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("/smallcases.json");
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

  function handleInvestmentAmountFilter(minInvestAmount) {
    setStatus({
      ...status,
      minInvestAmount: minInvestAmount,
    });
  }

  function handleVoltality(voltalityType) {
    setStatus({
      ...status,
      voltalityType:
        status.voltalityType == voltalityType ? null : voltalityType,
    });
  }

  function handleSortByFilter(type) {
    setStatus({
      ...status,
      sortByType: type,
    });
  }

  function handleInvestmentStrategy(type) {
    let set = new Set(status.investmentStrategySet);
    if (set.has(type)) {
      set.delete(type);
    } else {
      set.add(type);
    }
    setStatus({
      ...status,
      investmentStrategySet: set,
    });
    // console.log(set);
  }

  function handleOrderBy(orderBy){
    setStatus({
      ...status,
      orderBy:orderBy,
    })
    console.log(status.orderBy);
    

  }

  let filteredSmallCasesData = getFilteredSmallCasesData(
    status,
    smallCasesData
  );

  return (
    <>
      <div>{filteredSmallCasesData.length}</div>

      <NavBar handleSortByFilter={handleSortByFilter} status={status}  handleOrderBy={handleOrderBy}/>

      <div className="flex justify-center gap-4">
        <aside className=" flex flex-col gap-4 min-w-[300px]  p-4">
          <SideBar
            handleSubscriptionType={handleSubscriptionType}
            handleInvestmentAmountFilter={handleInvestmentAmountFilter}
            handleVoltality={handleVoltality}
            investmentStrategyListAsMap={investmentStrategyListAsMap}
            status={status}
            handleInvestmentStrategy={handleInvestmentStrategy}
          />
        </aside>
        <div className="allCards">
          <ul className=" w-[900px]">
            {filteredSmallCasesData.map((ele, index) => {
              return <Card ele={ele} key={ele._id} />;
            })}
          </ul>
        </div>
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
    <div className="flex  border-b border-b-gray-300    gap-4 p-4 py-6">
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
        <span>₹{ele.stats.minInvestAmount}</span>
      </div>
      <div className="catagire flex flex-col justify-center items-center flex-1/10 ">
        <span className="text-[#8f9399] font-light text-sm">
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
  investmentStrategyListAsMap,
  handleInvestmentStrategy,
  status,
}) {
  return (
    <>
      {/* Subscription Type */}
      <p className="text-xl font-bold  ">Subscription Type</p>
      <ul
        className={`menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box`}
      >
        {["Show All", "Free Access", "Fee Based"].map((ele) => {
          return (
            <li
              key={ele}
              onClick={() => handleSubscriptionType(ele)}
              className={`p-2 ${
                status.subscriptionType == ele ? "border border-blue-500" : null
              }`}
            >
              {ele}
            </li>
          );
        })}
      </ul>
      {/* investmentAmount */}
      <div className="investmentAmount">
        <p className=" text-xl font-bold "> Investment Amount</p>
        <ul className="flex flex-col gap-4">
          {["All", "Under ₹ 5000", "Under ₹ 25000", "Under ₹ 50000"].map(
            (ele, index) => {
              return (
                <li key={ele}>
                  <input
                    type="radio"
                    name="radio-1"
                    className={`radio `}
                    onChange={() => handleInvestmentAmountFilter(ele)}
                    checked={status.minInvestAmount == ele}
                  />{" "}
                  <span className="pl-2">{ele}</span>
                </li>
              );
            }
          )}
        </ul>
      </div>
      {/* Voltality */}
      <div className="Voltality ">
        <p className=" text-xl font-bold ">Voltality</p>
        <ul className="flex mt-4 gap-0.5">
          {["Low", "Medium", "High"].map((ele) => {
            return (
              <li key={ele}>
                <button
                  className={`py-1 px-4 border  ${
                    status.voltalityType == ele
                      ? "border-2 border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleVoltality(ele)}
                >
                  {ele}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="Investment Strategy">
        <p className=" text-xl font-bold ">Investment Strategy</p>
        <ul className="flex mt-4 flex-col gap-2">
          {...investmentStrategyListAsMap.keys().map((ele) => {
            return (
              <li key={ele}>
                <input
                  type="checkbox"
                  checked={status.investmentStrategySet.has(ele)}
                  onChange={() => handleInvestmentStrategy(ele)}
                />{" "}
                {investmentStrategyListAsMap.get(ele)}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function NavBar({ handleSortByFilter, status ,handleOrderBy}) {
  return (
    <div className="dropdown dropdown-start relative w-full flex flex-col justify-center items-center">
      <div tabIndex={0} role="button" className="btn m-1 bg-white">
        <span className="text-gray-400 font-light">Sort By </span>{" "}
        <span>{status.sortByType} </span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-white rounded-box w-fill p-2 shadow-sm absolute top-full mt-1 z-50"
      >
        {["Popularity", "Minimum Amount", "Recently Rebalanced"].map(
          (ele, index) => (
            <li className="flex flex-row items-center mt-2" key={ele}>
              <input
                type="radio"
                className="radio radio-neutral "
                name="radio"
                id={`radio1${index}`}
                onChange={() => handleSortByFilter(ele)}
                checked={status.sortByType == ele}
              />
              <label htmlFor={`radio1${index}`} className="ml-2">
                {ele}
              </label>
            </li>
          )
        )}
        <li className="mx-2 mr-2 flex flex-col gap-2 mt-2">
          <span>Returns</span>
          <span>Time Period</span>
          <ul className="flex flex-row   rounded border border-gray-300">
            {["1M", "6M", "1Y","2Y", "3Y", "5M"].map((ele) => {
              return (
                <li
                  key={ele}
                  className={`px-4 py-1 font-bold text-sm  ${status.sortByType==ele ? 'border text-blue-400 rounded ':'text-gray-400'} `}
                  onClick={() => handleSortByFilter(ele)}
                >
                  {ele}
                </li>
              );
            })}
           
          </ul>
        </li>
        <li className={`my-4 mx-2`} hidden={isNaN(parseInt(status.sortByType.substring(0, 1)))}>
  <span>Order By</span>
  <div className="flex justify-between">
    {["High-Low", "Low-High"].map((order) => (
      <button
        key={order}
        className={`px-4 py-1 border text-sm flex-1 font-bold rounded ${
          status.orderBy === order ? 'border text-blue-400' : 'text-gray-400'
        }`}
        onClick={() => handleOrderBy(order)}
      >
        {order}
      </button>
    ))}
  </div>
</li>

      </ul>
    </div>
  );
}

function getFilteredSmallCasesData(status, data) {
  let filterdData = [];
  let voltalityType = status.voltalityType;
  let subscriptionType = status.subscriptionType;
  let minInvestAmount = status.minInvestAmount;
  let investmentStrategy = status.investmentStrategySet;
  let sortByType = status.sortByType;

  // subscriptionType
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
    filterdData = [...data];
  }

  // minInvestAmount
  if (minInvestAmount == "All") {
    filterdData = [...filterdData];
  } else {
    let amount = parseInt(minInvestAmount.split("₹").slice(-1)[0].trim());
    filterdData = filterdData.filter((ele) => {
      let minInvestAmount = parseFloat(ele.stats.minInvestAmount);
      return minInvestAmount <= amount;
    });
  }

  // voltalityType
  if (voltalityType) {
    filterdData = filterdData.filter((ele) => {
      let volatility = ele.stats.ratios.riskLabel;
      return volatility == voltalityType + " Volatility";
    });
  }

  if (investmentStrategy && investmentStrategy.size != 0) {
    filterdData = filterdData.filter((ele) => {
      let list = ele.info.investmentStrategy;

      return [...investmentStrategy].some((strategy) =>
        list.some((item) => item.key === strategy)
      );
    });
  }

  //sortBY
  if (sortByType == "Popularity") {
    filterdData = filterdData.sort((e1, e2) => {
      return e1.brokerMeta.flags.popular - e2.brokerMeta.flags.popular;
    });
  } else if (sortByType == "Minimum Amount") {
    filterdData = filterdData.sort((e1, e2) => {
      return e1.stats.minInvestAmount - e2.stats.minInvestAmount;
    });
  } else if (sortByType =="Recently Rebalanced") {
    filterdData = filterdData.sort((e1, e2) => {
      const date1 = new Date(e1.info.lastRebalanced);
      const date2 = new Date(e2.info.lastRebalanced);
      return date2 - date1;
    });
  } else {
  
    filterdData = filterdData.filter((ele) => {
      let duration = ele.stats.ratios.cagrDuration.split('MY')[0];
      return duration == sortByType;
    });
     
      filterdData = filterdData.sort((e1, e2) => {
        let value1=parseFloat((e1.stats.ratios.cagr * 100))
        let value2=parseFloat((e2.stats.ratios.cagr * 100))
        if(status.orderBy=='High-Low') return value2-value1;
       else return value1-value2;
      });

  }

  return filterdData;
}

function getListOfInvestmentStrategy(smallcaseData) {
  let map = new Map();

  smallcaseData.forEach((ele) => {
    let investmentStrategy = ele.info.investmentStrategy;

    investmentStrategy.forEach((strategy) => {
      map.set(strategy.key, strategy.displayName);
    });
  });

  return map;
}
export default MainContainter;
