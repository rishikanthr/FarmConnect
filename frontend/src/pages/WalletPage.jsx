import WalletSection from "../components/WalletSection";

const WalletPage = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user?._id || user?.id;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-3xl mx-auto">
        <WalletSection userId={userId} />
      </div>
    </div>
  );
};

export default WalletPage;
