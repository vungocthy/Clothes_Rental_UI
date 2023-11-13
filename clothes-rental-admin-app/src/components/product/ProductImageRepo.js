import axios from "axios";
import { BASE_URL, BEAR_TOKEN } from "../../constants";


const requestDeleteOptions = {
    method: 'DELETE',
    headers: { 
      "Authorization": `Bearer ${BEAR_TOKEN}`
    }
  };

export async function DeleteImage(id){
    await axios.delete(BASE_URL+'images/'+id, requestDeleteOptions)
    .then(() => console.log('Delete successfull'))
    .catch((err)=>{
      console.log(err.message);
    });
}


export async function AddImage(image){
  var formData= new FormData();
  formData.append("productId",image.id);
  formData.append("file",image.file);
  var response ;
  await axios.post(BASE_URL+'images',
  formData
  ,{
    headers:{
      "Content-Type": ' multipart/form-data' ,
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(res => response=res.data)
  .catch(error => {
      console.error('There was an error!', error);
  });
  return response;
}