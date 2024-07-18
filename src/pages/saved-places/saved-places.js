import '/src/pages/saved-places/saved-places.scss';
import '/src/layout/footer/footer.js';
import pb from '/src/lib/utils/pocketbase';
import { getPbImageURL , deleteStorage, getStorage, insertBefore, insertAfter, insertFirst, insertLast } from "kind-tiger";

async function renderSavePlace(){
  const userInfo = await getStorage('pocketbase_auth');
  const userId = userInfo.model.id;
  const savePlace = await pb
    .collection('bookmark')
    .getList(1, 50, {
      filter: `user_id = "${userId}"`,
    });
  let placeInfo;
  let imgUrl;

  const saveCountTemplate =`
    <span>${savePlace.items.length}</span>
  `
  
  insertAfter('.header > h1',saveCountTemplate);



  for(let item of savePlace.items){
    placeInfo = await pb.collection('stores').getOne(item.stores_id);
    imgUrl = await getImgPath(placeInfo);

    const savePlaceTemplate =`
      <article class="saved-place">
        <div class="place-text">
          <div class="place-text__title">
            <h2>${placeInfo.name}</h2>
            <span>${placeInfo.category}</span>
          </div>

          <p>${placeInfo.address}</p>
        </div>

        <div class="place-img">
          <img src="${imgUrl[0]}" alt="" class="place-img--left"/>
          <img src="${imgUrl[1]}" alt="" class="place-img--right"/>
        </div>
      </article>
    `

    insertAfter('.saved-places',savePlaceTemplate);
  }
}

renderSavePlace();



async function getImgPath(placeData){
  const BASE_URL = 'https://vanilla-109place.pockethost.io';
  let placeImgData;
  let imgUrl = [];

  if(placeData.images[0]){
    placeImgData = await pb.collection('stores_images').getOne(placeData.images[0]);
  }

  for(let i=0 ; i<2 ; i++){
    if(!placeData.images[0]){
      imgUrl[i] = '../../assets/dog.png';
    }else{
      imgUrl[i] = `${BASE_URL}/api/files/${placeImgData.collectionId}/${placeImgData.id}/${placeImgData.images[i]}`
    }
  }

  return imgUrl;
}