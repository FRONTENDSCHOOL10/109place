

// 1. 키로 받은 값이 null이 아닌 값만 가져오기
// 2. 값 가져오면 JSON.parse
// 3. 파싱되면 키랑 묶어주기
// -> 받은 키 배열에서 키마다 돌려야됨 -> forEach

export function noNullParse(keys) {
   const obj = {};
   keys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item !== null) {
         const parseItem = JSON.parse(item);
         obj[key] = parseItem;
      }
   });
   return obj;
}
