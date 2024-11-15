import React, { useContext, useEffect, useState } from 'react';
import { ContextData } from '../Provider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Debt = () => {
    const navigate = useNavigate();
    const { reFetch, setReFetch, userName } = useContext(ContextData);

    const [isLoading, setIsLoading] = useState(false);
    const [contactNumberValue, setContactNumberValue] = useState("");

    // useEffect(() => {
    //     if(userName != "DEVELOPER") navigate('/');
    // }, [userName])

    // contact number input onchange
    const handleInputContactNumber = (event) => {
        const customerNumberValue = event.target.value;
        const onlyNumberRegex = /^[0-9]{0,11}$/;
        if (onlyNumberRegex.test(customerNumberValue)) {
            setContactNumberValue(customerNumberValue);
        }
    };

    const handleAddBorrower = (e) => {
        e.preventDefault();
        if(isLoading) return;
        setIsLoading(true);
        if(contactNumberValue.length < 11){
            setIsLoading(false);
            return toast.error("Invalid mobile number");
        }
        console.log('Working');
        setIsLoading(false);
    }

    return (
        <div className='px-2'>
            <div className='flex items-start justify-between'>
                <button onClick={() => document.getElementById("AddBorrower").showModal()} className='bg-green-600 text-white px-3 py-2 rounded-md'>Add Borrower</button>
                <span className='p-5 bg-red-600 text-white font-bold rounded-md'>Current Balance: 0.00</span>
            </div>


            {/* Add borrower modal start */}
            <dialog id="AddBorrower" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3 uppercase">Add Borrower:</h3>
                    <hr />
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-red-400 hover:bg-red-500">
                            ✕
                        </button>
                    </form>
                    <form onSubmit={handleAddBorrower} className="mt-5 space-y-5">
                        <label className="flex items-center">
                            <p className="w-1/2 font-semibold">Mobile Number:</p>{" "}
                            <input
                                type="text"
                                name="Borrower Number"
                                value={contactNumberValue}
                                onChange={handleInputContactNumber}
                                placeholder="Amount"
                                className="py-1 px-2 rounded-md outline-none border w-1/2"
                                required
                            />
                        </label>



                        <span className="flex items-start justify-end gap-3">
                            <input
                                type="reset"
                                value="Reset"
                                className="bg-yellow-300 py-2 px-4 rounded-md"
                            />

                            <button
                                className={`bg-green-500 py-2 px-4 rounded-md text-white hover:bg-green-600 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={isLoading}
                            >
                                Add
                            </button>
                        </span>
                    </form>
                </div>
            </dialog>
            {/* Add borrower modal end */}
        </div>
    );
};

export default Debt;