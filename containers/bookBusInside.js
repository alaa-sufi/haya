import * as React from "react";
import BookBusInside from "components/page/BookBusInside"
const bookBusInside = (role , vehicle) => {
  const wrappedComponent = (props) => (
    <BookBusInside role={role} vehicle={vehicle}  />
  );
  return wrappedComponent;
};
 
export default bookBusInside;