import { useQuery } from "@tanstack/react-query"
import { getTemplates } from "../api"
import { toast } from "react-toastify";

 const useTemplate=()=>{
    const {data,isLoading,isError,refetch}=useQuery({
    queryKey:['templates'],
        queryFn:async ()=>{
            try {
                const templates=await getTemplates();
                return templates;
            } catch (error) {
                toast.error(`Error:${error.message}`)
            }
        },
        refetchOnWindowFocus:false
    })

    return {
        data,isError,isLoading,refetch
    }
 }

 export default useTemplate