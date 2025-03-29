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
      }=props;

  return (
    <>
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
                  className={`py-1 px-4 border-2 rounded ${
                    status.voltalityType.has(ele)
                      ? " bg-[#e9f0fc] text-[#1f7ae0] font-medium "
                      : "border-gray-200"
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

export default SideBar;
