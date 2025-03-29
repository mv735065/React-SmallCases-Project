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

  let subscriptionTypeOptions = ["Show All", "Free Access", "Fee Based"];
  let investmentAmountOptions = [
    "All",
    "Under ₹ 5000",
    "Under ₹ 25000",
    "Under ₹ 50000",
  ];
  let volatilityOptions = ["Low", "Medium", "High"];
  let investmentStrategyListAsMap = getListOfInvestmentStrategy(smallCasesData);

  const sideBarProps = {
    handleSubscriptionType,
    handleInvestmentAmountFilter,
    handleVoltality,
    investmentStrategyListAsMap,
    status,
    handleInvestmentStrategy,
    subscriptionTypeOptions,
    investmentAmountOptions,
    volatilityOptions,
  };

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
      <NavBar
        handleSortByFilter={handleSortByFilter}
        status={status}
        handleOrderBy={handleOrderBy}
      >
        <div className="my-2 ml-4">{filteredSmallCasesData.length}</div>
      </NavBar>
      <div className="flex justify-center gap-4">
        <aside className=" flex flex-col gap-4 min-w-[300px]  p-4">
          <SideBar {...sideBarProps} />
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
  let { 
    voltalityType: voltalityTypeSet, 
    subscriptionType, 
    minInvestAmount, 
    investmentStrategySet, 
    sortByType, 
    orderBy 
  } = status;

  let filteredData = data.filter(ele => {
    // Filter by Subscription Type
    if (subscriptionType === "Free Access" && ele.flags.private) return false;
    if (subscriptionType === "Fee Based" && !ele.flags.private) return false;

    // Filter by Minimum Investment Amount
    if (minInvestAmount !== "All") {
      let amount = Number(minInvestAmount.replace(/[^0-9]/g, ""));
      if (ele.stats.minInvestAmount > amount) return false;
    }

    // Filter by Volatility Type
    if (voltalityTypeSet?.size && !voltalityTypeSet.has(ele.stats.ratios.riskLabel.split(" ")[0].trim())) {
      return false;
    }

    // Filter by Investment Strategy
    if (investmentStrategySet?.size && 
        !ele.info.investmentStrategy.some(item => investmentStrategySet.has(item.key))) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortFunctions = {
    "Popularity": (a, b) => a.brokerMeta.flags.popular - b.brokerMeta.flags.popular,
    "Minimum Amount": (a, b) => a.stats.minInvestAmount - b.stats.minInvestAmount,
    "Recently Rebalanced": (a, b) => new Date(b.info.lastRebalanced) - new Date(a.info.lastRebalanced),
  };

  if (sortByType in sortFunctions) {
    filteredData.sort(sortFunctions[sortByType]);
  } else {
    // Sorting by CAGR Duration
    filteredData = filteredData.filter(ele => ele.stats.ratios.cagrDuration.split("MY")[0] === sortByType);
    
    filteredData.sort((a, b) => {
      let valueA = a.stats.ratios.cagr * 100;
      let valueB = b.stats.ratios.cagr * 100;
      return orderBy === "High-Low" ? valueB - valueA : valueA - valueB;
    });
  }

  return filteredData;
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
