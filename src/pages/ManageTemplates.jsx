import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminIds, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplate from "../hooks/useTemplates";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
const ManageTemplates = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });
  const navigate=useNavigate();
  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });
  const {data:user,isLoading}=useUser()
  const [selectedTags, setSelectedTags] = useState([]);
  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({ ...prevData, [name]: value }));
  };
  //hanlde file changes
  const handleFileSelect = (e) => {
    setimageAsset((prevData) => ({ ...prevData, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Template/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setimageAsset((prevData) => ({
            ...prevData,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error: Authorization Revoked`);
          } else {
            toast.error(`Error:${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageAsset((prevData) => ({
              ...prevData,
              uri: downloadURL,
            }));
          });
          toast.success("Image uploaded!");
          setInterval(() => {
            setimageAsset((prevData) => ({
              ...prevData,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
      setimageAsset((prevData) => ({
        ...prevData,
        isImageLoading: false,
      }));
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  //handle deletion of uploaded file
  const deleteUploadedFile = async (e) => {
    e.preventDefault();

    setInterval(() => {
      setimageAsset((prevData) => ({
        ...prevData,
        progress: 0,
        uri: null,
      }));
    }, 1000);
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image deleted");
    });
  };

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  //save template in firebase database
  const uploadToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template-${templates.length + 1}`
          : "Template-1",
      timestamp: timestamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setformData((prevData) => ({
          ...prevData,
          title: "",
          imageURL: "",
        }));
        setimageAsset((prevData) => ({
          ...prevData,
          uri: null,
        }));
        setSelectedTags([]);
        templatesRefetch();
        toast.success("Template Saved Successfully.");
      })
      .catch((error) => {
        toast.error(`Error:${error.message}`);
      });
  };

  //remove existing template from database
  const removeTemplate=async (template)=>{
    const deleteRef=ref(storage,template?.imageURL);
    await deleteObject(deleteRef).then(async ()=>{
      await deleteDoc(doc(db,"templates",template?._id)).then(()=>{
        toast.success("Template deleted from the database")
        templatesRefetch();
      })
    }).catch((error)=>{
      toast.error(`Error:${error.message}`)
    })
  }

  useEffect(()=>{
    if(!isLoading && !adminIds.includes(user?.uid)){
      navigate('/',{replace:true});
    }
  },[user,isLoading])
  return (
    <div
      className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid
    grid-cols-1 lg:grid-cols-12"
    >
      {/* left container */}
      <div
        className="col-span-12 lg:col-span-4 2xl:col-span-3 
    w-full flex-1 flex flex-col items-center justify-start gap-4 px-2"
      >
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create New Template</p>
        </div>

        {/* template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID:
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template-${templates.length + 1}`
              : "Template-1"}
          </p>
        </div>

        {/* template title section */}

        <input
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary
     focus:text-txtDark focus:shadow-md outline-none"
        />

        {/* file uploader section */}

        <div
          className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer
        flex items-center justify-center"
        >
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div
                className="flex flex-col items-center justify-center
          gap-4"
              >
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer gap-4 flex-col">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to Upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/* delete uploaded file */}

                    <div
                      className="absolute top-4 right-4 w-8 h-8
             rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteUploadedFile}
                    >
                      <FaTrash className="text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* Tags */}

        <div className="w-full flex items-center flex-wrap gap-2 ">
          {initialTags.map((tag, index) => (
            <div
              key={index}
              className={`border border-gray-300 px-2 py-1 rounded-md
            cursor-pointer ${
              selectedTags.includes(tag) && "bg-blue-500 text-white"
            }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* button action */}
        <button
          type="button"
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={uploadToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div
        className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full
      flex-1 py-4"
      >
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[500px] rounded-md overflow-hidden
                  relative"
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/* delete uploaded file */}

                      <div
                        className="absolute top-4 right-4 w-8 h-8
               rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={()=>removeTemplate(template)}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                <PuffLoader color="#498FCD" size={40} />
                <p className="text-xl tracking-wider capitalize">No data</p>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ManageTemplates;
