import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { getTemplateById, saveToCollections, saveToFavourites } from "../api";
import { Loader, TemplatePin } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import useTemplate from "../hooks/useTemplates";
import { AnimatePresence,motion } from "framer-motion";

const TemplateDetails = () => {
  const { templateId } = useParams();
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["template", templateId],
    queryFn: () => getTemplateById(templateId),
  });
  const { data: user, refetch: userRefetch } = useUser();
  const {
    data: templates,
    refetch: templateRefetch,
    isLoading: tempLoading,
  } = useTemplate();
  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };
  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    templateRefetch();
    refetch();
  };
  if (isLoading) return <Loader />;
  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error while fetching the data...Please try again later!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* breadcrum section */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* design main section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div
          className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start
    gap-4"
        >
          {/* load template image */}
          <img
            src={data?.imageURL}
            className="w-full h-auto object-contain rounded-md"
            alt=""
          />

          {/* title and other options */}

          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title section */}
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              )}
            </div>

            {/* collection favourite options */}

            {user && (
              <div className="flex items-center justify-center gap-3">
                {user?.collections?.includes(data?._id) ? (
                  <>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300
                gap-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove from collections
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300
                  gap-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <BiFolderPlus className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to collections
                      </p>
                    </div>
                  </>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300
                      gap-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <BiSolidHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Remove from favourites
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={addToFavourites}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300
                        gap-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <BiHeart className="text-base text-txtPrimary" />
                      <p className="text-sm text-txtPrimary whitespace-nowrap">
                        Add to favourites
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div
          className="col-span-1 lg:col-span-4 w-full flex flex-col
        items-center justify-start px-3 gap-6"
        >
        {/* discover more section */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden
        relative"
            style={{
              background: "url(https://img.freepik.com/premium-photo/landscape-mountain-range-against-background-forest-mountain-lake-top-mountain-is-covered-with-snow-sunset_86390-10024.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1703721600&semt=ais)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
          
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md
        border-2 border-gray-50 text-white"
              >
                Discover More
              </Link>
            </div>
          </div>
          {
            user && (
              <Link to={`/resume/${data?.name}?templateId=${templateId}`}
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer ">
              <p className="text-white font-semibold text-lg">Edit this Template</p>
              </Link>
            )
          }

          {/* tags */}

          <div className="w-full flex items-center justify-start flex-wrap gap-2">
          {
            data?.tags?.map((tag,index)=>(
              <p key={index} className="text-xs border border-gray-300 px-2 py-1
               rounded-md whitespace-nowrap">{tag}</p>
            ))
          }
          </div>

        </div>
      </div>

      {/* similar templates */}

      {
        templates?.length > 0 && (
          <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtPrimary"> You might also like</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
          gap-2">
          <AnimatePresence>
          {templates?.filter((temp)=>temp._id !==data?._id).map((template, index) => (
              <TemplatePin key={template?._id} data={template} index={index} />
            ))}
          </AnimatePresence>
          </div>
          
          </div>
        )
      }
    </div>
  );
};

export default TemplateDetails;
