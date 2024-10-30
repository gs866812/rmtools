import React, { useContext, useEffect, useRef, useState } from 'react';
import useAxiosSecure from '../Components/hooks/useAxiosSecure';
import { ContextData } from '../Provider';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Summary = () => {
    const axiosSecure = useAxiosSecure();
    const { reFetch } = useContext(ContextData);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // ----------------------------Sales summary start---------------------------------------------------------
    const [summaryData, setSummaryData] = useState({
        saleSummary: {},
        purchaseSummary: {},
        expenseSummary: {},
    });

    const todaysDate = moment(new Date()).format("DD.MM.YYYY");

    useEffect(() => {
        axiosSecure.get("/getSummary")
            .then((response) => {
                setSummaryData(response.data);
                setLoading(false);

            })
            .catch((error) => {
                toast.error("Error fetching summary data:", error);
            });
    }, [reFetch, axiosSecure]);

    const { saleSummary, purchaseSummary, expenseSummary } = summaryData;



    // Prepare chart data
    const chartData = {
        labels: ["Total", "Cash", "Due", "Collected Due"],
        datasets: [
            {
                label: 'Sales',
                data: [
                    parseFloat(saleSummary.totalSales),
                    parseFloat(saleSummary.totalCashSales),
                    parseFloat(saleSummary.totalDue),
                    parseFloat(saleSummary.totalCollectedDueFromSales),
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Purchases',
                data: [
                    parseFloat(purchaseSummary.totalPurchase),
                    parseFloat(purchaseSummary.totalCashPurchase),
                    parseFloat(purchaseSummary.totalPurchaseDue),
                    parseFloat(purchaseSummary.totalCollectedDueFromPurchases),
                ],
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
            {
                label: 'Expenses',
                data: [parseFloat(expenseSummary.todaysCost), 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };


    // ----------------------------Sales summary end---------------------------------------------------------

    return (
        <div className="px-2 py-5">
            <h2 className='text-4xl font-bold text-center my-5 pb-5 uppercase'>Today's summary ({todaysDate})</h2>

            <div className='w-full mx-auto flex justify-between gap-5'>
                <div className='border-2 border-green-600 p-5 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold text-center underline uppercase'>Sales Summary</h2>
                    <div className='my-2 font-bold mt-5 text-center'>
                        <p className='text-xl text-green-600'>
                            Total Sales: {loading ? <span className="loading loading-spinner loading-xs"></span> : saleSummary.totalSales}
                        </p>
                        <p className='text-xl text-orange-500'>
                            Cash on Sale: {
                                loading ? <span className="loading loading-spinner loading-xs"></span> :
                                    saleSummary.totalCashSales
                            }
                        </p>
                        <p className='text-xl text-red-600'>
                            Total Due on Sales: {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                saleSummary.totalDue}
                        </p>

                        <p className='text-xl mt-3 text-green-500'>
                            Due Collections on Sales: {loading ? <span className="loading loading-spinner loading-xs"></span> : saleSummary.totalCollectedDueFromSales}
                        </p>
                    </div>
                </div>

                <div className='border-2 border-yellow-600 p-5 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold underline uppercase'>Purchase Summary</h2>
                    <div className='my-2 font-bold mt-5 text-center'>
                        <p className='text-xl text-green-600'>
                            Total Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> : purchaseSummary.totalPurchase}
                        </p>
                        <p className='text-xl text-orange-500'>
                            Cash on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> : purchaseSummary.totalCashPurchase}
                        </p>
                        <p className='text-xl text-red-600'>
                            Total Due on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> : purchaseSummary.totalPurchaseDue}
                        </p>

                        <p className='text-xl mt-3 text-green-500'>
                            Due Given on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> : purchaseSummary.totalCollectedDueFromPurchases}
                        </p>
                    </div>
                </div>

                <div className='border-2 border-red-600 p-5 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold underline uppercase'>
                        Total Expense
                    </h2>
                    <h2 className='text-center mt-10 text-red-600 text-4xl'>
                    {loading ? <span className="loading loading-spinner loading-xs"></span> : expenseSummary.todaysCost}
                    </h2>

                </div>


            </div>

            <div className='border border-gray-400 rounded-md p-5 mt-5'>
                {/* Showing chart here */}
                <Bar ref={chartRef} data={chartData} options={options} />
            </div>



        </div>
    );
};

export default Summary;
