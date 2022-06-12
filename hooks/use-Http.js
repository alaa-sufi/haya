// const config = {
//     headers: {
//       Authorization: "Bearer" + localStorage.getItem("token")
//     }
//   };
  const host = "http://127.0.0.1:8000";
  const useHttp = () => {
    async function UseApi(method, apiurl, outRequest , data) {
      try {
        const response = await fetch(`${!outRequest ? host+apiurl : apiurl}`, {
          method: method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const responsiveData = await response.json();
        if (!response.ok) {
          if (response.status === "404") {
            throw new Error("عذرا الصفحة غير موجودة");
          }
        }
        return responsiveData;
      } catch (error) {
        if (error.message === "Failed to fetch") {
          throw new Error("يرجى التأكد من الاتصال بالانترنت");
        }
        throw new Error(error.message);
      }
    }
    return { UseApi };
  };
  export default useHttp;
  