import * as React from "react";
import AdminSetting from "components/page/AdminSetting"
const adminSetting = (role) => {
  const wrappedComponent = (props) => (
    <AdminSetting role={role}  />
  );

  return wrappedComponent;
};
 
export default adminSetting;