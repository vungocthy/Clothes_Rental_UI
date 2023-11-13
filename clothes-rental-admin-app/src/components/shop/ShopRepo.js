import axios from "axios";
import {BASE_URL,BEAR_TOKEN,Id} from "../../constants/index.js";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN}`
  }
};

export async function addShop(shop) {
  console.log("Add Shop!");
  console.log(shop);
  var formData= new FormData();
  //formData.append("id",shop.id);
  formData.append("shopName",shop.shopName);
  formData.append("shopEmail",shop.shopEmail);
  formData.append("shopPhone",shop.shopPhone);
  formData.append("status","Active");
  formData.append("address",shop.address);
  formData.append("ownerId",shop.ownerId.id);
  formData.append("file", shop.files[0]);
  await axios.post(BASE_URL+'shops',
  formData,
  {
    headers:{
      "Content-Type": ' multipart/form-data' ,
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Added!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function saveShop(shop) {
  console.log("Update Shop!");
  var formData= new FormData();
  formData.append("id",shop.id);
  formData.append("shopName",shop.shopName);
  formData.append("shopEmail",shop.shopEmail);
  formData.append("shopPhone",shop.shopPhone);
  formData.append("address",shop.address);
  if("files" in shop){
    formData.append("file", shop.files[0]);
  }
  await axios.put(BASE_URL+'shops/'+shop.id,
  formData,
  {
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

export async function getShop(id) {
  console.log(`Get shop by ${id}!`);
  var response = await axios.get(BASE_URL+'shops/'+id,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}

export async function deleteShop(id) {
  await axios.delete(BASE_URL+'shops/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
}

export async function getShops() {
  console.log("Get all Shops!");
  var response = await axios.get(BASE_URL+'shops',
    {
      headers:{"Authorization": `Bearer ${BEAR_TOKEN}`}
    }
  )
  .catch((err)=>{
    console.log(err.message);
  });
  return response.data;
}

export async function getShopsByOwnerId() {
  console.log("Get all Shops!");
  var response = await axios.get(BASE_URL+'owners/'+Id+'/shops',
    {
      headers:{"Authorization": `Bearer ${BEAR_TOKEN}`}
    }
  )
  .catch((err)=>{
    console.log(err.message);
  });
  return response.data;
}