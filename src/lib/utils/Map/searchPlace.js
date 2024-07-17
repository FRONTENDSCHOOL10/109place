/* eslint-disable no-undef */
import { searchPlaceNoName } from './searchPlaceNoName';
// 장소 정보 가져오려고

// 검색 객체 생성
const searchPlace = new kakao.maps.services.Places();

// 받아야 되는 거 : keyword (주소 혹은 장소 이름)
// 키워드 받고 장소 서치 실행
export function needPlaceInfo(keyword) {
   return new Promise((resolve, reject) => {
      searchPlace.keywordSearch(keyword, async function (data, status) {
         if (status === kakao.maps.services.Status.OK) {
            let placeInfo = {
               place_name: data[0].place_name,
               road_address_name: data[0].road_address_name,
               x: data[0].x,
               y: data[0].y,
            };
            if (data[0].category_group_name !== undefined) {
               placeInfo['category_group_name'] = data[0].category_group_name;
            }
            resolve(placeInfo);
         } else {
            try {
               const placeInfo = await searchPlaceNoName(keyword);
               resolve(placeInfo);
            } catch (error) {
               reject('Place No Name');
               console.log(error);
            }
         }
      });
   });
}

// 호출할 때는 let makerPlaceInfo = await needPlaceInfo(place);
// 토금북로 40 같은 장소명이 정확히 없는 건 안 나옴 -> geo 를 쓰면 될 것 같은데
// 리뷰 쓸 때는 안 쓸 것 같고
// 홈페이지에서 장소 찾을 때나 쓸 듯? -> searchPlaceGeo (장소명 정확히 없는 장소 찾기용-그냥 위치 찾기용)

// 필요한 데이터 이름만 받을 수 있도록 리팩토링 가능해보임
