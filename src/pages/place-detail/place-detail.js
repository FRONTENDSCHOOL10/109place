import '/src/pages/place-detail/place-detail.scss';
import pb from '/src/lib/utils/pocketbase';
import { getStorage, setStorage } from "kind-tiger";

// 리뷰 이미지 스와이퍼
var swiper = new Swiper(".swiper", {
  slidesPerView: 1.8,
  spaceBetween: 6,
});



// 검색 페이지에서 검색한 가게 정보가 DB에 존재하는지 확인하는 함수
async function matchLocalWithDB(){

  // 검색 페이지에서 저장한 가게 이름과 주소 받아오기 (로컬 스토리지)
  const searchData = {
    name: '족발땡겨', //추후에 검색 페이지에서 로컬 스토리지에 저장한 데이터 받아오기
    category: '고기',
    address: '서울시 153-23',
    phone_number: 12334454,
    business_hours: '8:00~21:00'
  };

  // 포켓 베이스 접근
  const storeRecordData = await pb
    .collection('stores')
    .getFullList();


  const foundData = storeRecordData.filter( data => data.name === searchData.name && data.address === searchData.address);

  if(!foundData.length){
    insertData(searchData)
  }

  return foundData;
}



// stores 테이블에 Data 저장하는 함수
async function insertData(searchData){

  console.log(searchData);
  // const name = 

  // const data={
  //   name = name,
  //   category:,
  //   address:p,
  //   phone_number:p,
  //   reviews_count:,
  //   business_hours:,
  //   images:,
  // };

  // await pb
  //   .collection('stores')
  //   .create(data);
}






// 전체 로직 실행
matchLocalWithDB();




// 검색 -> 장소 상세
// 1. 검색에서 받은 데이터가 stores 테이블 안에 있는지 체크
//  1) 검색해서 장소 상세로 페이지 이동 시 클릭한 정보의 가게 이름과 주소 받아오기(로컬 스토리지)
//    sample) 로컬 스토리지에 가게 이름과 주소 저장. (페이지 연결 시 추후 삭제)
//            로컬 스토리지에서 가게 이름, 주소 가져오기.
//  2) 받아온 가게 이름과 주소가 모두 동일한 데이터가 테이블에 존재하는지 확인

// 2. 데이터 존재 여부에 따라 해당 방법으로 렌더링
//   1) 안에 있다면 -> 테이블에서 데이터 가져오기 -> 렌더링
//   2) 안에 없다면 -> 지도에서 데이터 가져오기 -> 테이블 저장 -> 렌더링