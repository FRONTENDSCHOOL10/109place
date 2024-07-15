/* eslint-disable no-undef */
import '/src/pages/homepage/homepage.scss';

/* ------------------- [ 지도 생성 ] ------------------ */
let container = document.getElementById('map');
let options = {
   center: new kakao.maps.LatLng(37.57089677546261, 126.9790586047037),
   level: 3, //지도의 레벨(확대, 축소 정도)
};
let map = new kakao.maps.Map(container, options);

/* -------------------- [ 임시 ] -------------------- */
// const button = document.querySelector('button');
// button.addEventListener('click', getInfo);

// 현재 좌표 불러오는 함수
// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다

/* ---------------- [ 클릭 좌표 가져오기 ] ---------------- */
// 클릭하면 클릭한 좌표가 나옴!
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
   // 클릭한 위도, 경도 정보를 가져옵니다
   let latlng = mouseEvent.latLng;
   marker.setPosition(latlng);
   let message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
   message += '경도는 ' + latlng.getLng() + ' 입니다';

   let resultDiv = document.getElementById('result');
   console.log(message);
});

/* ------------------- [ 마커 표시 ] ------------------ */

let imageSrc = `${import.meta.env.BASE_URL}src/assets/stack.svg#maker_review`,
   imageSize = new kakao.maps.Size(64, 69),
   imageOption = { offset: new kakao.maps.Point(27, 69) };

let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
   markerPosition = map.getCenter();
// 클릭한 곳에 마커 생성!
let marker = new kakao.maps.Marker({
   position: markerPosition,
   image: markerImage,
});

marker.setMap(map);

/* -------------- [ 좌표 주소 가져오기 ] -------------- */

//todo : Serach detail 에서 검색한 거 주소 가져와서 마커 띄워주는 식으로 해야될듯
//* 지금은 임의로 키워드 넣어서 표시되는 식으로 해둠.

var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 키워드로 장소를 검색합니다
ps.keywordSearch('멋쟁이 사자처럼', placesSearchCB);

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
   if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < data.length; i++) {
         displayMarker(data[i]);
         bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
   }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
   // 마커를 생성하고 지도에 표시합니다
   var marker = new kakao.maps.Marker({
      map: map,
      image: markerImage,
      position: new kakao.maps.LatLng(place.y, place.x),
   });

   // 마커에 클릭이벤트를 등록합니다
   kakao.maps.event.addListener(marker, 'click', function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
         //todo 이 부분 scss? 혹은 웹 컴포로 가능? 그럼 이거 scss 파일을 하나 더 만들어야 하나.
         '<div style="padding:1rem;font-size:12px;">' +
            place.place_name +
            '</div>'
      );
      infowindow.open(map, marker);
   });
}
