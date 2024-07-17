



const info = `
<div class="info">
  <div class="info__semi">
    <p class="info__name">${local.home_place_name}</p>
    ${local.home_category ? `<p class="info__category">${local.home_category}</p>` : ''}
  </div>
  ${local.home_road_address_name ? `<p class="info__address">${local.home_road_address_name}</p>` : ''}
</div>`

displayMarker(local, info);

function displayMarker(place, info) {
  const markerPosition = new kakao.maps.LatLng(
     place.home_search_y,
     place.home_search_x
  );
  const marker = new kakao.maps.Marker({
     map: map,
     image: markerImage,
     position: markerPosition,
  });

  // 커스텀 오버레이 생성
  const customOverlay = new kakao.maps.CustomOverlay({
     position: markerPosition,
     content: info,
     yAnchor: 1,
  });
  customOverlay.setMap(map);
}


