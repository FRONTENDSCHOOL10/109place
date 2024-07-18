import '/src/pages/saved-places/saved-places.scss';
import '/src/layout/footer/footer.js';
import pb from '/src/lib/utils/pocketbase';
import { getStorage, insertAfter, insertLast } from "kind-tiger";


//저장한 장소 렌더링
async function renderSavePlace(){
  const userInfo = await getStorage('pocketbase_auth');
  const userId = userInfo.model.id;
  const savePlace = await pb
    .collection('bookmark')
    .getList(1, 50, {
      filter: `user_id = "${userId}"`,
    });
  const savePlaceFooter = document.querySelector('c-footer');
  const savePlaceContainer = document.querySelector('.saved-places');

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
        <a href="/src/pages/place-detail/place-detail.html">
          <div class="place-text">
            <div class="place-text__title">
              <h2>${placeInfo.name}</h2>
              <span>${placeInfo.category}</span>
            </div>

            <p>${placeInfo.address}</p>
          </div>

          <div class="place-img">
            <img src="${imgUrl[0]}" alt="가게 이미지" class="place-img--left"/>
            <img src="${imgUrl[1]}" alt="가게 이미지" class="place-img--right"/>
          </div>
        </a>
      </article>
    `

    insertLast('.saved-places',savePlaceTemplate);
  }


  //스크롤 이동 시 푸터 지우기
  const scrollHandler = () => {
    if (savePlaceContainer.scrollTop > 0) {
      savePlaceFooter.classList.add('hidden');

      savePlaceContainer.style.height = 'auto';
      savePlaceContainer.style.maxHeight = '29.9rem';
    } else {
      savePlaceFooter.classList.remove('hidden');

      savePlaceContainer.style.height = `15.125rem`;
      savePlaceContainer.style.maxHeight = `15.125rem`;
    }
 };

 savePlaceContainer.addEventListener('scroll', scrollHandler);

}

renderSavePlace();



//이미지 링크 가져오기
async function getImgPath(placeData){
  const BASE_URL = 'https://vanilla-109place.pockethost.io';
  let placeImgData;
  let imgUrl = [];

  if(placeData.images[0]){
    placeImgData = await pb.collection('stores_images').getOne(placeData.images[0]);
  }

  for(let i=0 ; i<2 ; i++){
    if(!placeData.images[0]){
      imgUrl[i] = '../../assets/dog2.png';
    }else{
      imgUrl[i] = `${BASE_URL}/api/files/${placeImgData.collectionId}/${placeImgData.id}/${placeImgData.images[i]}`
    }
  }

  return imgUrl;
}