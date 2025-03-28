import React from "react";

function SideBar(props) {
  const {
    handleSubscriptionType,
    handleInvestmentAmountFilter,
    handleVoltality,
    investmentStrategyListAsMap,
    status,
    handleInvestmentStrategy,
    subscriptionTypeOptions,
    investmentAmountOptions,
    volatilityOptions,
    handleClearAllFilters,
    handleIncludeNewSmallCases
  } = props;

  return (
    <>
      <button
        className="border-2 border-gray-200 py-1 rounded hover:border-blue-400 "
        onClick={() => handleClearAllFilters()}
      >
        Clear All Filters
      </button>

      {/* Subscription Type */}
      <p className="text-xl font-bold  ">Subscription Type</p>
      <ul
        className={`flex flex-row  rounded font-bold text-[#8f9399] border border-gray-200 w-fit justify-center items-center`}
      >
        {subscriptionTypeOptions.map((ele) => {
          return (
            <li
              key={ele}
              onClick={() => handleSubscriptionType(ele)}
              className={`p-2 text-center rounded w-18  text-sm ${
                status.subscriptionType == ele
                  ? "border border-[#1f7ae0] font-bold text-[#1f7ae0] bg-[#e9f0fc]"
                  : null
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
          {investmentAmountOptions.map((ele, index) => {
            return (
              <li key={ele}>
                <input
                  type="radio"
                  name="radio-1"
                  className={`radio  bg-white  checked:bg-[#1f7ae0] checked:text-white   w-4 h-4`}
                  onChange={() => handleInvestmentAmountFilter(ele)}
                  checked={status.minInvestAmount == ele}
                />{" "}
                <span className="pl-2">{ele}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Voltality */}
      <div className="Voltality ">
        <p className=" text-xl font-bold ">Voltality</p>
        <ul className="flex mt-4 gap-0.5">
          {volatilityOptions.map((ele) => {
            return (
              <li key={ele}>
                <button
                  className={` flex flex-col px-2 py-1 border-2 rounded ${
                    status.voltalityTypeSet.has(ele)
                      ? "  text-[#1f7ae0] font-medium "
                      : "border-gray-200"
                  }`}
                  onClick={() => handleVoltality(ele)}
                >
                  <span>{ele}</span>
                  {ele.split(" ")[0].trim() == "Low" && (
                    <img src="/Images/1.png" />
                  )}
                  {ele.split(" ")[0].trim() == "Medium" && (
                    <img src="/Images/2.png" className="w-fit" />
                  )}
                  {ele.split(" ")[0].trim() == "High" && (
                    <img src="/Images/3.png" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className=" text-xl font-bold ">Launch Date</p>
        <input type="checkbox"  checked={status.includeNewSmallCases} onChange={()=>{
         handleIncludeNewSmallCases();
          
        }}/> <span>Recent SmallCases</span>
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

export default SideBar;
