import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { getUserDetail } from "../api";


const fetchUserInfo= async ()=>{
    try{
        const userDetail=await getUserDetail();
        return userDetail

    }catch(err){
        if(!err.message.includes("not authenticated")){
            toast.error("Something went wrong...")
        }
    }
}

const useUser = ()=>{
    const {data,isLoading,isError,refetch}=useQuery({
        queryKey:['user'],queryFn:fetchUserInfo, refecthOnWindowFocus:false
    }   
    );

    return {data,isLoading,isError,refetch}
};

export default useUser;