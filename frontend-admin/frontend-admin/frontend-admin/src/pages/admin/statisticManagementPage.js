import React from "react";
import useStatistics from "../../component/Statistic/useStatistics";
import BarChartComponent from "../../component/Statistic/BarChartComponent";
import PieChartComponent from "../../component/Statistic/PieChartComponent";
import LineChartComponent from "../../component/Statistic/LineChartComponent";
import ChartCard from "../../component/Statistic/ChartCard";
import "../../component/Statistic/styleForm.scss";

const StatisticsPage = () => {
  const { bookStats, userStats, commentStats, viewTrends } = useStatistics();

  const userRoleData = [
    { name: "Admin", value: userStats.adminCount },
    { name: "Author", value: userStats.authorCount },
    { name: "Reader", value: userStats.readerCount },
  ];

  return (
    <div className="statistics">
      <h1 className="statistics__title">Thống kê và Báo cáo</h1>

      <div className="statistics__grid">
        <ChartCard title="Thống kê Sách">
          <BarChartComponent
            data={bookStats}
            xKey="title"
            bars={[
              { dataKey: "views", color: "#8884d8", name: "Lượt xem" },
              { dataKey: "likes", color: "#82ca9d", name: "Lượt thích" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Thống kê Người dùng">
          <PieChartComponent data={userRoleData} />
        </ChartCard>

        <ChartCard title="Thống kê Bình luận">
          <BarChartComponent
            data={commentStats}
            xKey="bookTitle"
            bars={[{ dataKey: "commentCount", color: "#ffc658", name: "Số bình luận" }]}
          />
        </ChartCard>

        <ChartCard title="Xu hướng Lượt xem">
          <LineChartComponent data={viewTrends} xKey="date" yKey="views" />
        </ChartCard>
      </div>
    </div>
  );
};

export default StatisticsPage;
