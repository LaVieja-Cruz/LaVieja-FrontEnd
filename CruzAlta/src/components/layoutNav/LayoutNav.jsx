import { useAuth } from "../../context/AuthContext";
import AdminNav from "../adminNav/AdminNav";
import DeliveryNav from "../deliveryNav/DeliveryNav";
import PublicNav from "../publicNav/PublicNav";


const LayoutNav = () => {
  const { isLoggedIn, role } = useAuth(); 


  if (!isLoggedIn) return <PublicNav />;
  if (role === "1") return <AdminNav />;
  if (role === "3") return <DeliveryNav />;

  return <PublicNav />;
};

export default LayoutNav;
