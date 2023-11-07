import axios from "axios";
import {BASE_URL,BEAR_TOKEN_OWNER} from "../../constants/index.js";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN_OWNER}`
  }
};

export async function addCombo(combo) {
  console.log(combo);
  var formData= new FormData();
  formData.append("comboName",combo.comboName);
  formData.append("description",combo.description);
  formData.append("shopId",combo.shopId);
  //formData.append("quantity",combo.address);
  formData.append("status","Active");
  formData.append("file", combo.files[0]);

  await axios.post(BASE_URL+'combos',
  {
    formData
  },
  {
    headers:{
      "Content-Type": ' multipart/form-data' ,
      Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
    }
  })
  .then(response =>console.log("Added!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function saveCombo(combo) {
    console.log(combo);
    var formData= new FormData();
    formData.append("Id",combo.id);
    formData.append("ComboName",combo.comboName);
    formData.append("Description",combo.description);
    formData.append("Quantity",combo.quantity);
    // if("files" in combo){
    //     formData.append("File", combo.files[0]);
    // }
    console.log(formData.get("Id"))
    await axios.put(BASE_URL+'combos/'+combo.id,formData,
    {
      headers:{
        "Content-Type": ' multipart/form-data' ,
        Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
      }
    })
    .then(response =>console.log("Updated!"))
    .catch(error => {
        console.error('There was an error!', error);
    });
}

export async function getCombo(id) {
  console.log(`Get Combo by ${id}!`);
  var response = await axios.get(BASE_URL+'combos/'+id,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN_OWNER}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}

export async function deleteCombo(id) {
  await axios.delete(BASE_URL+'combos/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
}

export async function getCombos() {
  console.log("Get all combos!");
  var response = await axios.get(BASE_URL+'combos',
    {
      headers:{"Authorization": `Bearer ${BEAR_TOKEN_OWNER}`}
    }
  )
  .catch((err)=>{
    console.log(err.message);
  });
  return response.data;
}


export async function getProductCombo(q){

  console.log("Get all products - combo!");
  var response = await axios.get(BASE_URL+'products-combo?id=5f933c84-d392-4c98-968c-8f224ba55ba6')
  .catch((err)=>{
    console.log(err.message);
  });
   console.log(response.data);
  return {
    list: response.data,
    hasPrev: false,
    hasNext: false,
  };

}

export async function deleteProductCombo(id){
  console.log("Delete product - combo!");
  await axios.delete(BASE_URL+'products-combo/'+id)
    .catch((err)=>{
      console.log(err.message);
  });
}

export async function saveProductCombo(productCombo) {
  await axios.put(BASE_URL+'products-combo/'+productCombo.id,
  {
    id:productCombo.id,
    quantity:productCombo.quantity,
  },
  {
    headers:{
      Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
    }
  })
  .then(response =>console.log("Updated!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function addProductCombo(productCombo) {
  await axios.post(BASE_URL+'products-combo',
  {
    comboId:productCombo.id,
    quantity:productCombo.quantity,
    productId:productCombo.productId
  },
  {
    headers:{
      Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
    }
  })
  .then(response =>console.log("Updated!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}