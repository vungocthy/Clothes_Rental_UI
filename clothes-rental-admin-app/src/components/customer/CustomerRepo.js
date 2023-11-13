import axios from "axios";
import {BASE_URL,BEAR_TOKEN} from "../../constants/index.js";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN}`
  }
};

export async function addCustomer(owner) {
  console.log(owner);
  await axios.post(BASE_URL+'users',
  {
    name:owner.name,
    email:owner.email,
    password:'1',
    phone:owner.phone,
    gender:owner.gender,
    address:owner.address,
    role:'Owner'
  },
  {
    headers:{
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Added!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function saveCustomer(owner) {
  await axios.put(BASE_URL+'users/'+owner.id,
  {
    id:owner.id,
    name:owner.name,
    email:owner.email,
    password:owner.password,
    phone:owner.phone,
    gender:owner.gender,
    address:owner.address,
    role:'Owner'
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

export async function getCustomer(id) {
  console.log(`Get Owners by ${id}!`);
  var response = await axios.get(BASE_URL+'users'+id,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return response.data;
}

export async function deleteCustomer(id) {
  await axios.delete(BASE_URL+'users/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
}

export async function getCustomers() {
  console.log("Get all authors!");
  var response = await axios.get(BASE_URL+'customers',
    {
      headers:{"Authorization": `Bearer ${BEAR_TOKEN}`}
    }
  )
  .catch((err)=>{
    console.log(err.message);
  });
  console.log(response.data);
  return response.data;
}
