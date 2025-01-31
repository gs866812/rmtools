import { CiSearch } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ContextData } from "../../Provider";
import useAxiosProtect from "../hooks/useAxiosProtect";
import { FaFileExcel, FaRegFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const SupplierLedger = () => {
  const axiosSecure = useAxiosSecure();
  const axiosProtect = useAxiosProtect();
  const { reFetch, setReFetch, user, tokenReady } = useContext(ContextData);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [count, setCount] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [allSupplier, setAllSupplier] = useState([]);

  // get supplier due list
  useEffect(() => {
    axiosProtect
      .get(`/supplierLedger`, {
        params: {
          userEmail: user?.email,
          page: currentPage,
          size: itemsPerPage,
          search: searchTerm,
        },
      })
      .then((data) => {
        setSupplier(data.data.result);
        setCount(data.data.count);
      })
      .catch((err) => {
        toast.error("Server error, err");
      });
  }, [setReFetch, currentPage, itemsPerPage, searchTerm, axiosProtect]);

  // const navigate = useNavigate();

  const handleSupplierLedger = (id) => {
    // navigate(`/supplierLedger/id/${id}`);
    window.open(`/supplierLedger/id/${id}`, "_blank"); // Open in a new tab
  };

  // .............................................................
  useEffect(() => {
    axiosSecure
      .get("/singleSupplierCount")
      .then((res) => {
        setCount(res.data.count);
      })
      .catch((err) => {
        toast.error("Server error", err);
      });
  }, [reFetch]);

  // Pagination
  const totalItem = count;
  const numberOfPages = Math.ceil(totalItem / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    const totalPages = numberOfPages;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfMaxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      } else if (currentPage > totalPages - halfMaxPagesToShow) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1, "...");
        for (
          let i = currentPage - halfMaxPagesToShow;
          i <= currentPage + halfMaxPagesToShow;
          i++
        ) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  const handleItemsPerPage = (e) => {
    const val = parseInt(e.target.value);
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    // any other logic to handle page change
  };

  // search input onchange
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

  // Download full excel
  useEffect(() => {
    if (tokenReady && user?.email) {
      axiosProtect
        .get(`/allSupplier`, {
          params: {
            userEmail: user?.email,
          },
        })
        .then((data) => {
          setAllSupplier(data.data);
        })
        .catch((err) => {
          toast.error("Server error", err);
        });
    }

  }, [reFetch, tokenReady, axiosProtect, user?.email]);

  const downloadExcel = () => {
    // Format the data to include only the desired columns
    const formattedData = allSupplier.map((supplier) => ({
      "Supplier ID": supplier.supplierSerial,
      "Supplier Name": supplier.supplierName,
      "Contact No": supplier.contactNumber,
      "Address ": supplier.supplierAddress,
      "Due amount ": supplier.dueAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Due List");
    XLSX.writeFile(workbook, "supplierDueList.xlsx");
  };

  const downloadExcelCurrent = () => {
    // Format the data to include only the desired columns
    const formattedData = supplier.map((supplier) => ({
      "Supplier ID": supplier.supplierSerial,
      "Supplier Name": supplier.supplierName,
      "Contact No": supplier.contactNumber,
      "Address ": supplier.supplierAddress,
      "Due amount ": supplier.dueAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Due List");
    XLSX.writeFile(workbook, "currentPageCustomerDueList.xlsx");
  };

  return (
    <div className="mt-5 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl uppercase font-bold">Supplier ledger</h2>
          <FaFileExcel className="w-[20px] h-[20%] cursor-pointer ml-5 text-red-600" title="Download full list" onClick={downloadExcel} />
          <FaRegFileExcel className="w-[20px] h-[20%] cursor-pointer text-green-600" title="Download current list" onClick={downloadExcelCurrent} />
        </div>
        <label className="flex gap-1 items-center border py-1 px-3 rounded-md">
          <input
            onChange={handleInputChange}
            type="text"
            name="search"
            placeholder="Search"
            className=" hover:outline-none outline-none"
            size="13"
          />
          <CiSearch />
        </label>
      </div>

      {/* table */}

      <div>
        <div className="overflow-x-auto mt-5 pb-5">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="border bg-green-200 text-black">
                <th>Supplier ID</th>
                <th>Supplier name</th>
                <th>Address</th>
                <th>Contact person</th>
                <th>Contact No.</th>
                <th>Due AMount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {Array.isArray(supplier) &&
                supplier.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.supplierSerial}</td>
                    <td>{supplier.supplierName}</td>
                    <td>{supplier.supplierAddress}</td>
                    <td>{supplier.contactPerson}</td>
                    <td>{supplier.contactNumber}</td>
                    <td>
                      {supplier.dueAmount > 0
                        ? <span>BDT: {parseFloat(supplier.dueAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        : null}
                    </td>
                    <td>
                      {" "}
                      <IoEyeOutline
                        onClick={() =>
                          handleSupplierLedger(supplier.supplierSerial)
                        }
                        className="text-xl cursor-pointer hover:text-yellow-500"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {count > 10 && (
        <div className="my-8 flex justify-center gap-1">
          <button
            onClick={handlePrevPage}
            className="py-2 px-3 bg-green-500 text-white rounded-md hover:bg-gray-600"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {renderPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageClick(page)}
              className={`py-2 px-5 bg-green-500 text-white rounded-md hover:bg-gray-600 ${currentPage === page ? "!bg-gray-600" : ""
                }`}
              disabled={typeof page !== "number"}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            className="py-2 px-3 bg-green-500 text-white rounded-md hover:bg-gray-600"
            disabled={currentPage === numberOfPages}
          >
            Next
          </button>

          <select
            value={itemsPerPage}
            onChange={handleItemsPerPage}
            name=""
            id=""
            className="py-2 px-1 rounded-md bg-green-500 text-white outline-none"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SupplierLedger;
