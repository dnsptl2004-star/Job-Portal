import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);

    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const query = searchedQuery?.trim() ? `?keyword=${encodeURIComponent(searchedQuery)}` : "";
                const res = await axios.get(`${JOB_API_END_POINT}${query}`, { withCredentials: true });
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[dispatch, searchedQuery])
}

export default useGetAllJobs
