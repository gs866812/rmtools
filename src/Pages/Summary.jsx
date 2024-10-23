import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../Components/hooks/useAxiosSecure';
import { ContextData } from '../Provider';
import { toast } from 'react-toastify';

const Summary = () => {
    const axiosSecure = useAxiosSecure();
    const { reFetch } = useContext(ContextData);

    // ----------------------------Sales summary start---------------------------------------------------------
    const [summaryData, setSummaryData] = useState({
        saleSummary: {},
        purchaseSummary: {},
        expenseSummary: {},
    });

    useEffect(() => {
        axiosSecure.get("/getSummary")
            .then((response) => {
                setSummaryData(response.data);
            })
            .catch((error) => {
                toast.error("Error fetching summary data:", error);
            });
    }, [reFetch, axiosSecure]);

    const { saleSummary, purchaseSummary, expenseSummary } = summaryData;


    // ----------------------------Sales summary end---------------------------------------------------------

    return (
        <div className="px-2">
            <h2 className='text-4xl font-bold text-center my-5 pb-5 uppercase'>Today's summary</h2>

            <div className='w-full mx-auto flex gap-5'>
                <div className='w-1/2 space-y-5'>
                    <div className='border-2 border-green-600 p-5 rounded-lg shadow-md'>
                        <h2 className='text-3xl font-bold underline'>Sales Summary:</h2>
                        <div className='my-2 font-bold mt-5'>
                            <p className='text-2xl mb-2 text-green-600'>Total Sales: {saleSummary.totalSales}</p>
                            <p className='text-xl text-orange-500'>Sales on Cash: {saleSummary.totalCashSales}</p>
                            <p className='text-xl text-red-600 mt-2'>Total Due on Sales: {saleSummary.totalDue}</p>

                            <p className='text-xl mt-5 text-green-500'>Due Collections on Sales: {saleSummary.totalCollectedDueFromSales}</p>
                        </div>
                    </div>

                    <div className='border-2 border-yellow-600 p-5 rounded-lg shadow-md'>
                        <h2 className='text-3xl font-bold underline'>Purchase Summary:</h2>
                        <div className='my-2 font-bold mt-5'>
                            <p className='text-2xl mb-2 text-green-600'>Total Purchase: {purchaseSummary.totalPurchase}</p>
                            <p className='text-xl text-orange-500'>Purchase on Cash: {purchaseSummary.totalCashPurchase}</p>
                            <p className='text-xl text-red-600 mt-2'>Total Due on Purchase: {purchaseSummary.totalPurchaseDue}</p>

                            <p className='text-xl mt-5 text-green-500'>Due Given on Purchase: {purchaseSummary.totalCollectedDueFromPurchases}</p>
                        </div>
                    </div>

                    <div className='border-2 border-red-600 p-5 rounded-lg shadow-md'>
                        <h2 className='text-3xl font-bold underline'>Total Expense: {expenseSummary.todaysCost}</h2>

                    </div>
                </div>
                <div className='w-1/2 border border-gray-400 rounded-md p-2'></div>
            </div>



        </div>
    );
};

export default Summary;
