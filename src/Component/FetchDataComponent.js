import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    fetchDataRequest, fetchDataSuccess, fetchDataFailure,
} from '../store/action.js';

const FetchDataComponent = () => {
    const { API_DATA, loading, error } = useSelector((state) => state.API_DATA);
    const [Api_Data, Set_Api_DAta] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [name,setName]=useState('');
    const [trip,setTrip]=useState('');
    const itemsPerPage = 10; // Adjust the number of items per page as needed

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const [currentItems, setCurrentitems] = useState([]);


    useEffect(() => {
        setCurrentitems(Api_Data?.slice(indexOfFirstItem, indexOfLastItem))
        console.log(indexOfFirstItem, currentItems, 'current data in use effect')

    }, [Api_Data.length])
    const handlePageChange = (page) => {
        setCurrentPage(page);

    };
    const Edit_Handler = (id) => {
                console.log(name,trip,"Name and  trip");
                setTrip('');
                setName('');
    }
    const Delete_Handler = (id, i) => {
        const updatedApiData = Api_Data.filter((item) => item._id !== id);
        dispatch(fetchDataSuccess(updatedApiData));
        Set_Api_DAta(updatedApiData);
       // console.log('Input fie ', id);

    }
    const tripEdit = (id, value) => {
       // let newTrip = event.target.value;
        //console.log(newTrip,"these are trips");
        // console.log(currentItems)
        // console.log(id)

        setTrip(value);

        const valueUpdate=Api_Data?.map((w)=>{
            console.log(w._id==id)
            if(w._id==id){
                w.trips=value
                console.log(w)
            }
            return w
        })
        console.log(trip,"these are trips");
        Set_Api_DAta(valueUpdate)
    }
        const nameEdit = (id,value) => {
           // const newName = event.target.value;
            setName(value);
        };
    const dispatch = useDispatch();

    useEffect(() => {
        function fatchdata() {
            Set_Api_DAta(API_DATA);
        }
        fatchdata();
       // console.log(Api_Data, "Api_Data in use Effect ->")
    }, [API_DATA?.length])

    //console.log(data, ' in store');
    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchDataRequest());

            try {
                const response = await axios.get(
                    'https://api.instantwebtools.net/v1/passenger?page=1&size=30'
                );
                const RES = response.data;
                //  console.log(RES.data);
                dispatch(fetchDataSuccess(RES.data));
            } catch (error) {
                dispatch(fetchDataFailure(error.message));
            }
        };

        fetchData();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (<>

        <div>

            <ul>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.length > 0 &&
                            currentItems.map((item, i) => (
                                <tr key={item._id} className="hover:bg-gray-100 transition duration-300">
                                    <td className="w-1/4 px-6 py-4 text-center">{item._id}</td>
                                    <td className="w-1/4 px-6 py-4">
                                        <input
                                            type="text"
                                            value={ item.name} // name ||
                                            onChange={(event) => nameEdit(item._id, event.target.value)}
                                           
                                            className="border-none outline-none bg-white rounded px-2 py-1 hover:bg-gray-100"
                                        />
                                    </td>
                                    <td className="w-1/4 px-6 py-4" >
                                        <input
                                            type="text"
                                            value={item.trips}
                                            onChange={(event) => tripEdit(item._id, event.target.value)}
                                          
                                            className="border-none outline-none bg-white rounded px-2 py-1 hover:bg-gray-100"
                                        />
                                    </td>
                                    <td className="w-1/4 px-6 py-4">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                                            onClick={() => Edit_Handler(item._id)}>
                                            Edit
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                                            onClick={() => Delete_Handler(item._id, i)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

            </ul>
        </div>


        <div className="flex justify-center mt-4"> {/* Center the buttons */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2 ${currentPage === 1 ? 'cursor-not-allowed' : '' // Apply the cursor-not-allowed class when disabled
                    }`}
            >
                Previous
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={indexOfLastItem >= Api_Data.length}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${indexOfLastItem >= Api_Data.length ? 'cursor-not-allowed' : '' // Apply the cursor-not-allowed class when disabled
                    }`}
            >
                Next
            </button>
        </div>
        <div className="mt-2 text-center"> {/* Center the page information */}
            Page {currentPage} of {Math.ceil(Api_Data.length / itemsPerPage)}
        </div>


    </>
    );
};

export default FetchDataComponent;
