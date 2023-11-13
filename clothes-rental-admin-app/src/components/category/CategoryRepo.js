import axios from "axios";
import {BASE_URL, BEAR_TOKEN} from "../../constants/index.js";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN}`
  }
};

export async function addCategory(category){
  var formData= new FormData();
  formData.append("categoryName",category.name);
  var response =await axios.post(BASE_URL+'categories/',
  formData
  ,{
    headers:{
      "Content-Type": ' multipart/form-data' ,
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log('Added!'))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function saveCategory(category) {
  var formData= new FormData();
  formData.append("id",category.id);
  formData.append("categoryName",category.categoryName);

  await axios.put(BASE_URL+'categories/'+category.id,
  formData
  ,{
    headers:{
      "Content-Type": ' multipart/form-data' ,
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Updated!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function getCategory(id) {
  console.log(`Get Category by ${id}!`);
  var response = await axios.get(BASE_URL+'categories'+id,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}

export async function deleteCategory(id) {
  await axios.delete(BASE_URL+'categories/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
}


export async function getCategories() {
  console.log("Get All Categories!");
  var response = await axios.get(BASE_URL+'categories',
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}