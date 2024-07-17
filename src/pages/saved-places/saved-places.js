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
  const BASE_URL = 'https://vanilla-109place.pockethost.io';


  const saveCountTemplate =`
    <span>${savePlace.items.length}</span>
  `
  
  insertAfter('.header > h1',saveCountTemplate);



  for(let item of savePlace.items){
    placeInfo = await pb.collection('stores').getOne(item.stores_id);

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
          <img src="${BASE_URL}/api/files/${placeInfo.collectionId}/${placeInfo.id}/${imgs[0]}" alt="" class="place-img--left"/>
          <img src="${BASE_URL}/api/files/${placeInfo.collectionId}/${placeInfo.id}/${imgs[0]}" alt="" class="place-img--right"/>
        </div>
      </article>
    `

    insertAfter('.saved-places',savePlaceTemplate);
  }
}

renderSavePlace();