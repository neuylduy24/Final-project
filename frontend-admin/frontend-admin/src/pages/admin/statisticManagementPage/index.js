import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.scss';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const StatisticsPage = () => {
    const [bookStats, setBookStats] = useState([]);
    const [userStats, setUserStats] = useState({ adminCount: 0, authorCount: 0, readerCount: 0 });
    const [commentStats, setCommentStats] = useState([]);
    const [viewTrends, setViewTrends] = useState([]);

    // Dữ liệu mock
    const mockBookStats = [
        { title: 'Book A', views: 120, likes: 40 },
        { title: 'Book B', views: 90, likes: 30 },
        { title: 'Book C', views: 150, likes: 70 },
    ];

    const mockUserStats = { adminCount: 5, authorCount: 10, readerCount: 50 };

    const mockCommentStats = [
        { bookTitle: 'Book A', commentCount: 25 },
        { bookTitle: 'Book B', commentCount: 15 },
        { bookTitle: 'Book C', commentCount: 30 },
    ];

    const mockViewTrends = [
        { date: '2025-02-18', views: 80 },
        { date: '2025-02-19', views: 150 },
        { date: '2025-02-20', views: 120 },
        { date: '2025-02-21', views: 180 },
        { date: '2025-02-22', views: 160 },
    ];

    useEffect(() => {
        axios.get('/api/statistics/books')
            .then(response => setBookStats(response.data.length ? response.data : mockBookStats))
            .catch(() => setBookStats(mockBookStats));

        axios.get('/api/statistics/users')
            .then(response => setUserStats(response.data || mockUserStats))
            .catch(() => setUserStats(mockUserStats));

        axios.get('/api/statistics/comments')
            .then(response => setCommentStats(response.data.length ? response.data : mockCommentStats))
            .catch(() => setCommentStats(mockCommentStats));

        axios.get('/api/statistics/view-trends')
            .then(response => setViewTrends(response.data.length ? response.data : mockViewTrends))
            .catch(() => setViewTrends(mockViewTrends));
    }, []);

    const userRoleData = [
        { name: 'Admin', value: userStats.adminCount },
        { name: 'Author', value: userStats.authorCount },
        { name: 'Reader', value: userStats.readerCount },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="statistics">
            <h1 className="statistics__title">Thống kê và Báo cáo</h1>

            <div className="statistics__grid">
                <div className="chart-card">
                    <h2 className="chart-card__title">Thống kê Sách</h2>
                    <div className="chart-card__content">
                        <BarChart width={600} height={300} data={bookStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" name="Lượt xem" />
                            <Bar dataKey="likes" fill="#82ca9d" name="Lượt thích" />
                        </BarChart>
                    </div>
                </div>

                <div className="chart-card chart-card--pie">
                    <h2 className="chart-card__title">Thống kê Người dùng</h2>
                    <div className="chart-card__content">
                        <PieChart width={430} height={400}>
                            <Pie
                                data={userRoleData}
                                cx={200}
                                cy={200}
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>

                <div className="chart-card">
                    <h2 className="chart-card__title">Thống kê Bình luận</h2>
                    <div className="chart-card__content">
                        <BarChart width={600} height={300} data={commentStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="bookTitle" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="commentCount" fill="#ffc658" name="Số bình luận" />
                        </BarChart>
                    </div>
                </div>

                <div className="chart-card">
                    <h2 className="chart-card__title">Xu hướng Lượt xem</h2>
                    <div className="chart-card__content">
                        <LineChart width={600} height={300} data={viewTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="views" stroke="#ff7300" name="Lượt xem" />
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
