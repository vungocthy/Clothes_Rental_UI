import {
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { pageSizeLimit } from "../common/app.config";
import { firebaseAuth, firestore } from "../../firebase.config";

import axios from "axios";
import { BASE_URL,BEAR_TOKEN } from "../../constants";

const collectionName = "orders";

export async function updateOrderStatus(order) {
  console.log(order);
  await axios.put(BASE_URL+'orders/'+order.id,
  {
    id:order.id,
    status:order.status
  },
  {
    headers:{
      Authorization: `Bearer ${BEAR_TOKEN}`
    }
  })
  .then(response =>console.log("Updated Order!"))
  .catch(error => {
      console.error('There was an error!', error);
  });
}

export async function getOrder(id) {
  console.log(id);
  console.log("Get order by Id!");
  var response = await axios.get(BASE_URL+'orders/'+id,
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



export async function removeOrderItem(order, item) {

}


export async function getOrders(q) {
  console.log("Get All Orders!");
  var response = await axios.get(BASE_URL+'orders?shopId='+q.shopId,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  return {
    list: response.data,
    hasPrev: false,
    hasNext: false
  };

}
