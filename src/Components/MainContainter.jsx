import React, { useEffect, useState } from "react";
import Card from "./Card";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

let subscriptionTypeOptions = ["Show All", "Free Access", "Fee Based"];
let investmentAmountOptions = [
  "All",
  "Under ₹ 5000",
  "Under ₹ 25000",
  "Under ₹ 50000",
];

let volatilityOptions = ["Low", "Medium", "High"];

let sortByTimePeriodOptions = {
  "1M": "monthly",
  "6M": "halfyearly",
  "1Y": "yearly",
  "3Y": "threeYear",
  "5Y": "fiveYear",
};

let sortByOptions = new Set([
  "Popularity",
  "Minimum Amount",
  "Recently Rebalanced",
]);

const MainContainter = () => {
  const [smallCasesData, setSmallCasesData] = useState([]);
  const [status, setStatus] = useState({
    subscriptionType: "Show All",
    minInvestAmount: "All",
    voltalityTypeSet: new Set(),
    investmentStrategySet: new Set(),
    sortByType: "Popularity",
    orderBy: "High-Low",
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

  function handleClearAllFilters() {
    setStatus({
      ...status,
      subscriptionType: "Show All",
      minInvestAmount: "All",
      voltalityTypeSet: new Set(),
      investmentStrategySet: new Set(),
    });
  }

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
    let set = new Set(status.voltalityTypeSet);
    if (set.has(voltalityType)) {
      set.delete(voltalityType);
    } else {
      set.add(voltalityType);
    }
    setStatus({
      ...status,
      voltalityTypeSet: set,
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

  const sideBarProps = {
    status,
    handleSubscriptionType,
    handleInvestmentAmountFilter,
    handleVoltality,
    handleInvestmentStrategy,
    subscriptionTypeOptions,
    investmentAmountOptions,
    volatilityOptions,
    investmentStrategyListAsMap,
    handleClearAllFilters,
  };

  const navBarProps = {
    status,
    sortByTimePeriodOptions: Object.keys(sortByTimePeriodOptions),
    sortByOptions,
    handleSortByFilter,
    handleOrderBy,
  };

  return (
    <>
      <NavBar {...navBarProps}>
        <div className=" border border-gray-200 px-4 py-1 rounded">
          <span>Results</span> {"    " + filteredSmallCasesData.length}
        </div>
      </NavBar>
      <div className="flex justify-center gap-8">
        <aside className="flex flex-col gap-4 max-w-[300px] p-4">
          <SideBar {...sideBarProps} />
        </aside>

        <div
          className={`allCards ${
            filteredSmallCasesData.length === 0 ? "min-w-[900px] " : null
          } `}
        >
          {" "}
          {/* Minimum height for the container */}
          <ul className="max-w-[900px]">
            {filteredSmallCasesData.length === 0 ? (
              <li className="text-center mt-10">No cards available</li>
            ) : (
              filteredSmallCasesData.map((ele) => {
                return (
                  <Card
                    ele={ele}
                    key={ele._id}
                    status={status}
                    sortByOptions={sortByOptions}
                    sortByTimePeriodOptions={sortByTimePeriodOptions}
                  />
                );
              })
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
function getFilteredSmallCasesData(status, data) {
  let {
    voltalityTypeSet,
    subscriptionType,
    minInvestAmount,
    investmentStrategySet,
    sortByType,
    orderBy,
  } = status;

  let filteredData = data.filter((ele) => {
    let voltalityType = ele.stats.ratios.riskLabel.split(" ")[0].trim();
    let investmentStrategy = ele.info.investmentStrategy;
    let investAmount = ele.stats.minInvestAmount;

    // Filter by Subscription Type
    if (subscriptionType === "Free Access" && ele.flags.private) return false;
    if (subscriptionType === "Fee Based" && !ele.flags.private) return false;

    // Filter by Minimum Investment Amount
    if (minInvestAmount !== "All") {
      let amount = Number(minInvestAmount.replace(/[^0-9]/g, ""));
      if (investAmount > amount) return false;
    }

    // Filter by Volatility Type
    if (
      voltalityTypeSet &&
      voltalityTypeSet.size &&
      !voltalityTypeSet.has(voltalityType)
    ) {
      return false;
    }

    // Filter by Investment Strategy
    if (
      investmentStrategySet &&
      investmentStrategySet.size &&
      !investmentStrategy.some((item) => investmentStrategySet.has(item.key))
    ) {
      return false;
    }

    return true;
  });

  // Sorting Logic
  const sortFunctions = {
    Popularity: (a, b) =>
      a.brokerMeta.flags.popular - b.brokerMeta.flags.popular,
    "Minimum Amount": (a, b) =>
      a.stats.minInvestAmount - b.stats.minInvestAmount,
    "Recently Rebalanced": (a, b) =>
      new Date(b.info.lastRebalanced) - new Date(a.info.lastRebalanced),
  };

  if (sortByType in sortFunctions) {
    filteredData.sort(sortFunctions[sortByType]);
  } else {
    // Sorting by  Return Duration
    let timePeriod = sortByTimePeriodOptions[sortByType];

    filteredData.sort((a, b) => {
      let valueA = a.stats.returns[timePeriod] * 100;
      let valueB = b.stats.returns[timePeriod] * 100;
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
