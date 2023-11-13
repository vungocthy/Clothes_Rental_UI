import { PhotographIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState,useContext } from "react";
import ProductImage from "./ProductImage";
import { toast } from "react-toastify";
import { DeleteImage,AddImage } from "./ProductImageRepo";
import { Actions, useAPIRequest } from "../common/api-request";
import { LoadingContext } from "../common/Contexts";
import { parseError } from "../common/utils";

export function ProductImagesEdit({ id ,images, onImagesChange = (blobs, urls) => {} }) {
  const [list, setList] = useState([]);
  const [productId,setProductId]=useState();
  const [addState, requestAdd] = useAPIRequest(AddImage);
  const [delState,requestDelete]=useAPIRequest(DeleteImage);

  const fileRef = useRef();
  
  useEffect(()=>{
  },[list]);

  useEffect(() => {
    setList(images ?? []); 
  }, [images]);

  useEffect(() => {
    setProductId(id?? ''); 
  }, [id]);

  useEffect(() => {
    if(delState.status===Actions.success){
      toast.success("Deleted image successfully!");
    }

    if (delState.status === Actions.failure) {
      toast.error(parseError(delState.error));
    }
  }, [delState]);

  useEffect(() => {
    if(addState.status===Actions.success){
      toast.success("Add image successfully!");
    }

    if (addState.status === Actions.failure) {
      toast.error(parseError(addState.error));
    }
  }, [addState]);

  function handleFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size / (1024.0 * 1024.0);

      if (fileSize > 0.512) {
        toast.error("Image file size must not exceed 512KB.");
      } else {
        requestAdd({
          id:productId,
          file:file
        });
        const imgs = [...list, file];
        setList(imgs);
        console.log(imgs);
        onImagesChange(
          imgs.filter((e) => typeof e === "object"),
          imgs.filter((e) => typeof e === "string")
        );
      }
     
      fileRef.current.value = "";
      //console.log('Add');
    }
  }

  function handleImageDelete(index,id) {
    if (index === null || index === undefined) {
      return;
    }
    if(typeof id === "string"){
      requestDelete(id);
    }

    let imgs = [...list];
    imgs.splice(index, 1);
    setList(imgs);
    
    onImagesChange(
      imgs.filter((e) => typeof e === "object"),
      imgs.filter((e) => typeof e === "string")
    );

   // console.log('Delete');
  }

  return (
    <div className="flex flex-wrap">
     {list.map((e,i) => {
        if(e.fileUrl=== undefined){
          return (
            <ProductImage
              key={i}
              image={e}
              onDelete={() => handleImageDelete(i,e)}
            />
          );
        }
        else{
          return (
            <ProductImage
              key={i}
              image={e.fileUrl}
              onDelete={() => handleImageDelete(i,e.id)}
            />
          );
        } 
      })}

      {list.length < 5 && (
        <div
          role="button"
          className="shadow-sm w-[140px] aspect-square bg-gray-200 hover:bg-gray-300 rounded mr-2 mb-2 p-5"
          onClick={() => fileRef.current.click()}
        >
          <div className="flex flex-col items-center justify-center border-2 border-gray-400 border-dashed h-full w-full rounded">
            <PhotographIcon className="text-gray-500 w-11 h-11" />
            <div className="font-medium text-gray-500">Choose</div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/x-png,image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
}


export function ProductImagesAdd({ images, onImagesChange = (blobs, urls) => {} }) {
  const [list, setList] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    setList(images ?? []); 
  }, [images]);

  function handleFileChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSize = file.size / (1024.0 * 1024.0);

      if (fileSize > 0.512) {
        toast.error("Image file size must not exceed 512KB.");
      } else {
        const imgs = [...list, file];
        setList(imgs);
        onImagesChange(
          imgs.filter((e) => typeof e === "object"),
          imgs.filter((e) => typeof e === "string")
        );
      }

      fileRef.current.value = "";
      //console.log('Add');
    }
  }

  function handleImageDelete(index) {
    if (index === null || index === undefined) {
      return;
    }


    let imgs = [...list];
    imgs.splice(index, 1);
    setList(imgs);

    onImagesChange(
      imgs.filter((e) => typeof e === "object"),
      imgs.filter((e) => typeof e === "string")
    );

   // console.log('Delete');
  }

  return (
    <div className="flex flex-wrap">
      {list.map((e, i) => {
        return (
          <ProductImage
            key={i}
            image={e}
            onDelete={() => handleImageDelete(i)}
          />
        );
      })}

      {list.length < 5 && (
        <div
          role="button"
          className="shadow-sm w-[140px] aspect-square bg-gray-200 hover:bg-gray-300 rounded mr-2 mb-2 p-5"
          onClick={() => fileRef.current.click()}
        >
          <div className="flex flex-col items-center justify-center border-2 border-gray-400 border-dashed h-full w-full rounded">
            <PhotographIcon className="text-gray-500 w-11 h-11" />
            <div className="font-medium text-gray-500">Choose</div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/x-png,image/jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
}