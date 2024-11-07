import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContextData } from '../Provider';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import useAxiosProtect from '../Components/hooks/useAxiosProtect';
import { motion } from 'framer-motion';

const Summary = () => {
    const { reFetch, tokenReady, user } = useContext(ContextData);
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // ----------------------------Sales summary start---------------------------------------------------------
    const [summaryData, setSummaryData] = useState({
        saleSummary: {},
        purchaseSummary: {},
        expenseSummary: {},
    });

    const todaysDate = moment(new Date()).format("DD.MM.YYYY");

    const axiosProtect = useAxiosProtect();
    useEffect(() => {
        if (tokenReady && user?.email) {
            axiosProtect.get("/getSummary", {
                params: {
                    userEmail: user?.email,
                },
            })
                .then((response) => {
                    setSummaryData(response.data);
                    setLoading(false);

                })
                .catch((error) => {
                    toast.error("Error fetching summary data:", error);
                });
        }

    }, [reFetch, axiosProtect, tokenReady, user?.email]);

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

                {/* ************************ */}
                <div className="relative p-5 rounded-lg shadow-md overflow-hidden border-2 border-transparent animate__animated animate__zoomIn">
                    {/* Moving border effect */}
                    <div className="absolute inset-0 rounded-lg border-animation"></div>

                    {/* Content inside the border */}
                    <div className="relative z-10 bg-white rounded-lg">
                        <h2 className="text-2xl font-bold text-center underline uppercase">Sales Summary</h2>
                        <div className="my-2 font-bold mt-5 space-y-2">
                            <p className="text-xl border-b border-orange-600 flex justify-between rounded-md px-2">
                                Total Sales: {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <span className=''>
                                        {parseFloat(saleSummary.totalSales).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </p>
                            <p className="text-xl border-b border-orange-600 flex justify-between rounded-md px-2">
                                Cash on Sale: {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <span>
                                        {parseFloat(saleSummary.totalCashSales).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </p>
                            <p className="text-xl border-b border-orange-600 flex justify-between rounded-md px-2">
                                Total Due on Sales: {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <span>
                                        {parseFloat(saleSummary.totalDue).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </p>
                            <p className="text-xl mt-3 border-b border-orange-600 flex gap-2 justify-between rounded-md px-2">
                                Due Collections on Sales: {loading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <span>
                                        {parseFloat(saleSummary.totalCollectedDueFromSales).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>


                </div>

                {/* ************************ */}

                <div className="relative p-5 rounded-lg shadow-md overflow-hidden border-2 border-transparent animate__animated animate__zoomIn">
                    {/* Moving border effect */}
                    <div className="absolute inset-0 rounded-lg border-animation"></div>
                    <div className="relative z-10 bg-white rounded-lg">
                        <h2 className='text-2xl font-bold underline uppercase'>Purchase Summary</h2>
                        <div className='my-2 font-bold mt-5 text-center space-y-2'>
                            <p className='text-xl border-b border-orange-600 flex justify-between rounded-md px-2'>
                                Total Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                    <span>
                                        {parseFloat(purchaseSummary.totalPurchase).toLocaleString(undefined, {
                                            minimumFractionDigits: 2, maximumFractionDigits: 2
                                        })}
                                    </span>
                                }
                            </p>
                            <p className='text-xl border-b border-orange-600 flex justify-between rounded-md px-2'>
                                Cash on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                    <span>
                                        {parseFloat(purchaseSummary.totalCashPurchase).toLocaleString(undefined, {
                                            minimumFractionDigits: 2, maximumFractionDigits: 2
                                        })}
                                    </span>
                                }
                            </p>
                            <p className='text-xl border-b border-orange-600 flex justify-between rounded-md px-2'>
                                Total Due on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                    <span>
                                        {parseFloat(purchaseSummary.totalPurchaseDue).toLocaleString(undefined, {
                                            minimumFractionDigits: 2, maximumFractionDigits: 2
                                        })}
                                    </span>
                                }
                            </p>

                            <p className='text-xl mt-3 border-b border-orange-600 flex justify-between gap-2 rounded-md px-2'>
                                Due Given on Purchase: {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                    <span>
                                        {parseFloat(purchaseSummary.totalCollectedDueFromPurchases).toLocaleString(undefined, {
                                            minimumFractionDigits: 2, maximumFractionDigits: 2
                                        })}
                                    </span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
                {/* ************************ */}

                <div className="relative p-5 rounded-lg shadow-md overflow-hidden border-2 border-transparent animate__animated animate__zoomIn">
                    {/* Moving border effect */}
                    <div className="absolute inset-0 rounded-lg border-animation"></div>
                    <div className="relative z-10 bg-white rounded-lg">
                        <h2 className='text-2xl font-bold underline uppercase'>
                            Total Expense
                        </h2>
                        <h2 className='text-center mt-10 text-red-600 text-4xl'>
                            {loading ? <span className="loading loading-spinner loading-xs"></span> :
                                <span>
                                    {parseFloat(expenseSummary.todaysCost).toLocaleString(undefined, {
                                        minimumFractionDigits: 2, maximumFractionDigits: 2
                                    })}
                                </span>
                            }
                        </h2>

                    </div>
                </div>

                {/* ***************************** */}

            </div>

            <div className='border border-gray-400 rounded-md p-5 mt-5'>
                {/* Showing chart here */}
                <Bar ref={chartRef} data={chartData} options={options} />
            </div>



        </div>
    );
};

export default Summary;
