import { getCategories } from "../category/CategoryRepo";
import { pageSizeLimit } from "../common/app.config";
import { getProductSetting } from "../../setting/SettingRepo";
import axios from "axios";
import { BASE_URL,BEAR_TOKEN } from "../../constants";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN}`
  }
};

export async function addProduct(p) {
  console.log(p.shopId);
  console.log(p.product);
  var formData= new FormData();
  formData.append("Status",'Active');
  formData.append("ProductName",p.product.productName);
  formData.append("Description",p.product.description);
  formData.append("Material",p.product.material);
  formData.append("Price",p.product.price);
  formData.append("Compesation",p.product.compesation);
  formData.append("CategoryId",p.product.categoryId);
  
  formData.append("ShopId",p.shopId);
  formData.append("File",p.product.files[0]);
  if(p.product.size!== undefined){
    formData.append("Size",p.product.size);
  }

  if(p.product.color!== undefined){
    formData.append("Color",p.product.color);
  }
  
  if(p.product.rootProductId!== undefined){
    formData.append("RootProductId",p.product.rootProductId);
  }

  await axios.post(BASE_URL+'products',
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


export async function saveProduct(product) {
  var formData= new FormData();
  formData.append("id",product.id);
  formData.append("ProductName",product.productName);
  formData.append("Description",product.description);
  if(product.size !==null && product.color!==null){
    formData.append("Size",product.size);
    formData.append("Color",product.color);
  } 
  formData.append("Material",product.material);
  formData.append("Price",product.price);
  formData.append("Compesation",product.compesation);
  formData.append("CategoryId",product.categoryId);

  await axios.put(BASE_URL+'products/'+product.id,
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

export async function getProduct(id) {
  var response = await axios.get(BASE_URL+'products/'+id, 
    {
      headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
    })
    .catch((err)=>{
      console.log(err.message);
    });
    return response.data;
}

export async function getProductEdit(id) {
  const product = id?  await getProduct(id):{};

  const categories = await getCategories();

  if (!product.id) {
    product.category = categories.length > 0 ? categories[0].id : "";
  }

  return {
    product: product,
    categories: categories
  };
}

export async function deleteProduct(id) {
  await axios.delete(BASE_URL+'products/'+id, requestDeleteOptions)
  .then(() => console.log('Delete successfull'))
  .catch((err)=>{
    console.log(err.message);
  });
}


export async function getProducts(q) {
  console.log(q.shopId);
  console.log("Get All Product!");
  var response = await axios.get(BASE_URL+`shops/${q.shopId}/products`+`?pageNumber=${q.pageIndex}&pageSize=${pageSizeLimit}`,
  {
    headers: {"Authorization": `Bearer ${BEAR_TOKEN}`}
  })
  .catch((err) => {
    console.log(err.message);
  });
  
  return {
        list: response.data.items,
        hasPrev: response.data.previous,
        hasNext: response.data.next,
      };

}