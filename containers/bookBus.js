import * as React from "react";
import BookBus from "components/page/BookBus"
const bookBus = (role ,vehicle) => {
  const wrappedComponent = (props) => (
    <BookBus role={role} vehicle={vehicle} />
  );

  return wrappedComponent;
};
 
export default bookBus;