import axios from "axios";
import {BASE_URL,BEAR_TOKEN} from "../../constants/index.js";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN}`
  }
};

export async function addCombo(c) {
  var formData= new FormData();
  formData.append("ComboName",c.combo.comboName);
  formData.append("Description",c.combo.description);
  formData.append("ShopId",c.shopId);
  formData.append("Quantity",c.combo.quantity);
  formData.append("Status","Active");
  formData.append("File", c.combo.files[0]);

  await axios.post(BASE_URL+'combos',
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
        Authorization: `Bearer ${BEAR_TOKEN}`
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
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}

export async function deleteCombo(id) {
  console.log('Delete Combo : '+id);
  var response = await axios.delete(BASE_URL+'combos/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
  return response;
}

export async function getCombos(shopId) {
  console.log("Get all combos!");
  var response = await axios.get(BASE_URL+'combos?shopId='+shopId,
    {
      headers:{"Authorization": `Bearer ${BEAR_TOKEN}`}
    }
  )
  .catch((err)=>{
    console.log(err.message);
  });
  return response.data;
}


export async function getProductCombo(q){
  console.log("Get all products - combo!");
  var response = await axios.get(BASE_URL+'combos/'+q.comboId+'/products-combo')
  .catch((err)=>{
    console.log(err.message);
  });
  return {
    list: response.data,
    hasPrev: false,
    hasNext: false,
  };

}

export async function deleteProductCombo(id){
  console.log("Delete product - combo!");
  await axios.delete(BASE_URL+'products-combo/'+id,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
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
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Updated!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function addProductCombo(productCombo) {
  console.log(productCombo);
  const data=[
    {
      comboId:productCombo.comboId,
      quantity:0,
      productId:productCombo.productId
    }
  ];
  var response= await axios.post(BASE_URL+'products-combo',data,
  {
    headers:{
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Updated!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
  return response;
}

export async function getNonProductCombo(q){
  console.log("Get all products - combo!");
  var response = await axios.get(BASE_URL+'products-combo?comboId='+q.comboId+'&shopId='+q.shopId)
  .catch((err)=>{
    console.log(err.message);
  });
  console.log(response.data);
  return {
    list: response.data,
    hasPrev: false,
    hasNext: false,
  }
}