/* eslint-disable no-undef */
// 리뷰 쓸 때는 안 쓸 것 같고
// 홈페이지에서 장소 찾을 때나 쓸 듯? -> searchPlaceGeo (장소명 정확히 없는 장소 찾기용-그냥 위치 찾기용)

let geocoder = new kakao.maps.services.Geocoder();

export function searchPlaceNoName(place) {
   return new Promise((resolve, reject) => {
      geocoder.addressSearch(place, async function (data, status) {
         // 정상적으로 검색이 완료됐으면
         if (status === kakao.maps.services.Status.OK) {
            let placeInfo = {
               // 빌딩네임이 있으면 빌딩 네임, 없으면 그냥 주소
               place_name:
                  data[0].road_address.building_name !== ''
                     ? data[0].road_address.building_name
                     : place,
               road_address_name: data[0].road_address.address_name,
               x: data[0].x,
               y: data[0].y,
            };
            resolve(placeInfo);
         } else {
            reject('Place search failed');
         }
      });
   });
}
