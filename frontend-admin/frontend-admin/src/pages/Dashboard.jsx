const Dashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <CardStats title="Số sách" value="1200" />
          <CardStats title="Đơn hàng" value="350" />
          <CardStats title="Doanh thu" value="$50,000" />
          <CardStats title="Người dùng" value="500" />
        </div>
      </div>
    );
  };
  
  const CardStats = ({ title, value }) => {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-gray-700">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default Dashboard;
  