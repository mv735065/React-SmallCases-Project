import React, { useEffect, useState } from "react";
import Card from "./Card";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const MainContainter = () => {
  const [smallCasesData, setSmallCasesData] = useState([]);
  const [status, setStatus] = useState({
    subscriptionType: "Show All",
    minInvestAmount: "All",
    voltalityType: new Set(),
    investmentStrategySet: new Set(),
    sortByType: "Popularity",
    orderBy: "High-Low",
  });

  let subscriptionTypeOptions=["Show All", "Free Access", "Fee Based"];
  let investmentAmountOptions=["All", "Under ₹ 5000", "Under ₹ 25000", "Under ₹ 50000"];
  let volatilityOptions=["Low", "Medium", "High"];
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
    let set = new Set(status.voltalityType);
    if (set.has(voltalityType)) {
      set.delete(voltalityType);
    } else {
      set.add(voltalityType);
    }
    setStatus({
      ...status,
      voltalityType: set,
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
  }

  function handleOrderBy(orderBy) {
    setStatus({
      ...status,
      orderBy: orderBy,
    });
  }

  let filteredSmallCasesData = getFilteredSmallCasesData(
    status,
    smallCasesData
  );

  return (
    <>
      <div>{filteredSmallCasesData.length}</div>

      <NavBar
        handleSortByFilter={handleSortByFilter}
        status={status}
        handleOrderBy={handleOrderBy}
      />

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

function getFilteredSmallCasesData(status, data) {
  let filterdData = [];
  let voltalityTypeSet = status.voltalityType;
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
  if (voltalityTypeSet && voltalityTypeSet.size!=0) {
    filterdData = filterdData.filter((ele) => {
      let volatility = ele.stats.ratios.riskLabel;
      return voltalityTypeSet.has(volatility.split(" ")[0].trim());
       
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
  } else if (sortByType == "Recently Rebalanced") {
    filterdData = filterdData.sort((e1, e2) => {
      const date1 = new Date(e1.info.lastRebalanced);
      const date2 = new Date(e2.info.lastRebalanced);
      return date2 - date1;
    });
  } else {
    filterdData = filterdData.filter((ele) => {
      let duration = ele.stats.ratios.cagrDuration.split("MY")[0];
      return duration == sortByType;
    });

    filterdData = filterdData.sort((e1, e2) => {
      let value1 = parseFloat(e1.stats.ratios.cagr * 100);
      let value2 = parseFloat(e2.stats.ratios.cagr * 100);
      if (status.orderBy == "High-Low") return value2 - value1;
      else return value1 - value2;
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
