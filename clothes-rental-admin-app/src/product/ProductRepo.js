import { getCategories } from "../components/category/CategoryRepo";
import { pageSizeLimit } from "../components/common/app.config";
import { getProductSetting } from "../setting/SettingRepo";
import axios from "axios";
import { BASE_URL,BEAR_TOKEN_OWNER } from "../constants";
const collectionName = "books";

const requestDeleteOptions = {
  method: 'DELETE',
  headers: { 
    "Authorization": `Bearer ${BEAR_TOKEN_OWNER}`
  }
};

export async function addProduct(product) {
  console.log(product);
  // var formData= new FormData();
  // formData.append("Status",'Active');
  // formData.append("ProductName",product.productName);
  // formData.append("Description",product.description);
  // formData.append("Size",product.size);
  // formData.append("Color",product.color);
  // formData.append("Material",product.material);
  // formData.append("Price",product.price);
  // formData.append("Compesation",product.compesation);
  // formData.append("CategoryId",product.categoryId);
  // formData.append("RootProductId",product.rootProductId);
  // formData.append("ShopId",product.shopId);
  // formData.append("File",product.files);
  // await axios.post(BASE_URL+'products/'+product.id,
  // formData,
  // {
  //   headers:{
  //     "Content-Type": ' multipart/form-data' ,
  //     Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
  //   }
  // })
  // .then(response =>console.log("Updated!"))
  // .catch(error => {
  //     console.error('There was an error!', error);
  // });
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
      Authorization: `Bearer ${BEAR_TOKEN_OWNER}`
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
      headers: {"Authorization": `Bearer ${BEAR_TOKEN_OWNER}`}
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

   //console.log(product);
  // console.log(categories);
  // console.log(productSetting);
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
    headers: {"Authorization": `Bearer ${BEAR_TOKEN_OWNER}`}
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