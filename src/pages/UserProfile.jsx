import React, { useEffect, useState } from 'react'
import useUser from '../hooks/useUser'
import { AnimatePresence } from 'framer-motion';
import useTemplate from '../hooks/useTemplates';
import { Loader, TemplatePin } from '../components';
import { useNavigate } from 'react-router-dom';
import { NoData } from '../assets';
import { useQuery } from '@tanstack/react-query';
import { getSavedResumes } from '../api';

const UserProfile = () => {
  const {data:user,isLoading:userLoading}=useUser();
  const [activeTab,setActiveTab]=useState('collections')
  const {data:templates,isLoading:temp_isLoading,isError:temp_isError}=useTemplate()
  const {data:savedResumes,isLoading:resumeIsLoading,refetch:refetchResume}=useQuery({
    queryKey:["savedResumes"],
    queryFn:()=> {
      if (user && user.uid) {
        return getSavedResumes(user.uid);
      } else {
        // Handle the case when user or user.uid is undefined
        return null;
      }
    }
  })
  const navigateTo=useNavigate()
 

  
  useEffect(()=>{
    if(!user && !userLoading ){
      navigateTo("/auth",{replace:true})
    }
  },[])

  if(temp_isLoading || userLoading || resumeIsLoading){
    return <Loader/>
  } 
  else{ refetchResume()}

  return (
    <div className='w-full flex flex-col items-center justify-start py-12'>
    <div className='w-full h-72 bg-blue-50'>
    <img 
    src={"https://img.freepik.com/free-vector/halftone-background-with-circles_23-2148907689.jpg?w=740&t=st=1705205528~exp=1705206128~hmac=2de999d6e00c77513b29f25b142cd1f642820f215f8729440a5e2218e2765657"}
    alt=''
    className='w-full h-full object-cover'/>

    <div className='flex items-center justify-center flex-col gap-4'>
    {
      user?.photoURL ? (
        <>
        <img
        src={user?.photoURL}
        className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
        alt=''
        referrerPolicy='no-referrer'
        loading='lazy'
        />
        </>
      )
      :
      (
        <>
        <img
        src={"https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1705205810~exp=1705206410~hmac=fa79d1b65170ee92e4d00ea09d11e4ab9414578b205744247a2255c4fb2bb675"}
        className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
        alt=''
        referrerPolicy='no-referrer'
        loading='lazy'
        />
        </>
      )
    }

    <p className='text-2xl text-txtDark'>{user?.displayName}</p>
    </div>


    {/* tabs */}

    <div className='flex items-center justify-center mt-12'>
    <div className={`px-4 py-2 rounded-md flex items-centerjcenter
    gap-2 group cursor-pointer`}
    onClick={()=>setActiveTab('collections')}>
    <p className={`text-base text-txtPrimary rounded-full px-4 py-1
    group-hover:text-blue-600 ${activeTab==='collections' && "bg-white shadow-md text-blue-600"}
    `}>Collections</p>
    </div>

    <div className={`px-4 py-2 rounded-md flex items-centerjcenter
    gap-2 group cursor-pointer`}
    onClick={()=>setActiveTab('resumes')}>
    <p className={`text-base text-txtPrimary rounded-full px-4 py-1
    group-hover:text-blue-600 ${activeTab==='resumes' && "bg-white shadow-md text-blue-600"}
    `}>My Resumes</p>
    </div>
    </div>

    {/* tab content */}

    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
    2xl:grid-cols-4 gap-2 px-4 py-6'>
    <AnimatePresence>
    {
      activeTab==='collections' ? (
        <>
        {
        user?.collections.length > 0 && user?.collections ? 
        (<RenderTemplate templates={templates?.filter((template)=>user?.collections?.includes(template?._id))}/>)
        :(<div className='col-span-12 w-full
        flex flex-col items-center justify-center gap-3'>
        <img
        src={NoData}
        className='w-32 h-auto object-contain'
        alt=''
        />
        <p>No data</p>
        </div>)
        }
        </>
      )
      :
      activeTab==='resumes' &&
      (
        <>
        {
        savedResumes?.length > 0 && savedResumes ? 
        (<RenderTemplate templates={savedResumes}/>)
        :(<div className='col-span-12 w-full
        flex flex-col items-center justify-center gap-3'>
        <img
        src={NoData}
        className='w-32 h-auto object-contain'
        alt=''
        />
        <p>No data</p>
        </div>)
        }
        </>
      )
    }
    </AnimatePresence>
    </div>
    </div>
    </div>
  )
}

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <AnimatePresence>
          {templates &&
            templates.map((template, index) => (
              <TemplatePin key={template?._id} data={template} index={index} />
            ))}
        </AnimatePresence>
      )}
    </React.Fragment>
  );
};

export default UserProfile