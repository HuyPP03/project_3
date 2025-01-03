import District from "../components/District";
import Header from "../components/Header";
import Owner from "../components/Owner";
import Province from "../components/Province";
import Search from "../components/Search";
import User from "../components/User";
import { useEthers } from "../context/EthersProvider";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const { loading, role } = useEthers();

  const renderWithRole = (role: string | null) => {
    switch (role) {
      case "OWNER":
        return <Owner />;
      case "PROVINCE":
        return <Province />;
      case "DISTRICT":
        return <District />;
      case "USER":
        return <User />;
      case "ADMIN":
      default:
        return null;
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Header />
      {loading ? (
        <div className="w-full flex-1 flex justify-center items-center">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
        </div>
      ) : (
        <>
          <Search />
          {renderWithRole(role)}
        </>
      )}
      <Toaster />
    </div>
  );
};

export default Home;
