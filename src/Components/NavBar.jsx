import React from 'react'

function NavBar({ handleSortByFilter, status ,handleOrderBy,children}) {
    return (<div className='flex gap-8 border'>
   
        {children}
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
              <li className={`flex flex-row items-center mt-2  ${status.sortByType == ele ? 'text-blue-400 font-bold':null }`} key={ele}>
                <input
                  type="radio"
                  className={`radio  bg-white  checked:bg-blue-400 checked:text-white   w-4 h-4`}
                  name="radio"
                  id={`radio1${index}`}
                  onChange={() => handleSortByFilter(ele)}
                  checked={status.sortByType == ele}
                />
                <label htmlFor={`radio1${index}`} className="ml-2 ">
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
                    className={`px-4 py-1 font-bold text-sm  ${status.sortByType==ele ? 'border text-blue-400 rounded bg-[#e9f0fc]':'text-gray-400'} `}
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
            status.orderBy === order ? 'border text-blue-400 bg-[#e9f0fc]'  : 'text-gray-400'
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
      </div>
    );
  }

export default NavBar