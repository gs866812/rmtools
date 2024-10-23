import React, { useContext, useEffect, useState } from 'react';
import useAxiosSecure from '../Components/hooks/useAxiosSecure';
import { ContextData } from '../Provider';
import moment from 'moment';

const Summary = () => {
    const axiosSecure = useAxiosSecure();
    const { reFetch } = useContext(ContextData);

// ----------------------------Sales summary start---------------------------------------------------------
    const [sales, setSales] = useState([]);
    useEffect(() => {
        axiosSecure.get("/getFullSales")
        .then((data) => setSales(data.data));
    }, [reFetch, axiosSecure]);

    const todaysDate = moment(new Date()).format("DD.MM.YYYY");

    // Filter sales for today's date
    const todaysSales = sales.filter(sale => sale.date === todaysDate);

    // Calculate totals
    const totalSales = todaysSales.reduce((acc, sale) => acc + sale.grandTotal, 0);
    const totalDue = todaysSales.reduce((acc, sale) => acc + sale.dueAmount, 0);
    const totalCashSales = todaysSales.reduce((acc, sale) => acc + sale.finalPayAmount, 0);

    console.log("Today's Total Sales:", totalSales);
    console.log("Today's Total Due:", totalDue);
    console.log("Today's Total Cash Sales:", totalCashSales);

// ----------------------------Sales summary end---------------------------------------------------------

    return (
        <div className="px-2">
            This is summary
        </div>
    );
};

export default Summary;
