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
    formData.append("comboId",combo.id);
    formData.append("comboName",combo.comboName);
    formData.append("description",combo.description);
    formData.append("shopId",combo.shopId);
    //formData.append("quantity",combo.address);
    formData.append("status","Active");
    if("files" in combo){
        formData.append("file", combo.files[0]);
    }
    await axios.put(BASE_URL+'combos/'+combo.id,
    {
        formData
    },
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
  var response = await axios.get(BASE_URL+'combos'+id,
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
  console.log(response.data);
  return response.data;
}
