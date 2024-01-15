import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { hoveredScaling } from "../animations";
import { FiltersData } from "../utils/helpers";
import useFilters from './../hooks/useFilters';
import { useQueryClient } from "@tanstack/react-query";
const Filters = () => {
  const [isHovered, setIsHovered] = useState(false);
  const {data:filterData}=useFilters();
  const queryClient=useQueryClient();
  const handleFilterValue=(value)=>{
    queryClient.setQueryData(['globalFilter'],{...queryClient.getQueryData(['globalFilter']),searchTerm:value})
  }
  const clearFilter=()=>{
    queryClient.setQueryData(["globalFilter"], {
      ...queryClient.getQueryData(["globalFilter"]),
      searchTerm: "",
    });
  }
  
  return (
    <div className="w-full flex items-center justify-start py-4">
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mr-2
      cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl" />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...hoveredScaling}
              className="absolute -top-8 -left-2 bg-white shadow-md
          rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6
      scrollbar-none">
      {FiltersData && FiltersData.map((filterItem)=>(
        <div key={filterItem.id} onClick={()=>handleFilterValue(filterItem.value)}
         className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md
         ${filterData && filterData.searchTerm===filterItem.value &&'bg-gray-300 shadow-md'}`}>
        <p className="text-sm text-txtPrimary group-hover:text-txtDark
        whitespace-nowrap">{filterItem.label}</p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Filters;
