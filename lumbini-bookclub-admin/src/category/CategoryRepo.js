import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  deleteDoc,
  query,
  limit,
  where,
  orderBy,
} from "firebase/firestore/lite";
import { firebaseAuth, firestore } from "../firebase.config";
import {BASE_URL,BEAR_TOKEN_OWNER} from "../constants/index.js";

const collectionName = "categories";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN_OWNER}`
  }
};


export async function saveCategory(category) {
  const formData = new FormData();

  formData.append('Id', category.id);
  formData.append('CategoryName', category.name);
  console.log(category);
  console.log(category.id);
  console.log(category.name);
  var dataJson=JSON.stringify({
    Id:'1d143a74-91e1-402a-a0bd-7f7cf09cec01',
    CategoryName:'category.name'
  });
  console.log(dataJson);
  await fetch(BASE_URL+'/api/categories/'+category.id, 
  {
    method: 'PUT',
    headers: {
       "Authorization": `Bearer ${BEAR_TOKEN_OWNER}`
      },
    body:dataJson
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
}

export async function getCategory(id) {
  const db = firestore;

  let snapShot = await getDoc(doc(db, collectionName, id));

  return { ...snapShot.data(), id: snapShot.id };
}

export async function deleteCategory(id) {
  await fetch(BASE_URL+'/api/categories/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successful'))
  .catch((err)=>{
    console.log(err.message);
  });
}



export async function getCategories() {
  console.log(BASE_URL);
  return await fetch(BASE_URL+'/api/categories',
    {
      headers: {"Authorization": `Bearer ${BEAR_TOKEN_OWNER}`}
    })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err.message);
    });
}