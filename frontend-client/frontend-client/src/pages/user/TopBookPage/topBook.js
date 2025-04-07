import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';
import BookRankingApi from '../../../api/BookRankingApi';
import BookCard from '../../../component/Book/Card/bookDetailCard';
import './topBooks.scss';

const TopBooksPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [dailyTop, setDailyTop] = useState([]);
    const [weeklyTop, setWeeklyTop] = useState([]);
    const [monthlyTop, setMonthlyTop] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const [
                    dailyData,
                    weeklyData,
                    monthlyData
                ] = await Promise.all([
                    BookRankingApi.getTopDailyScore(),
                    BookRankingApi.getTopWeeklyScore(),
                    BookRankingApi.getTopMonthlyScore()
                ]);

                setDailyTop(dailyData);
                setWeeklyTop(weeklyData);
                setMonthlyTop(monthlyData);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderBookList = (books) => {
        if (loading) {
            return <Typography>Loading...</Typography>;
        }

        if (!books || books.length === 0) {
            return <Typography>No books found</Typography>;
        }

        return (
            <div className="book-list">
                {books.map((book, index) => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        rank={index + 1}
                        score={book.combinedScore.toFixed(1)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="top-books-page">
            <Typography variant="h4" className="page-title">
                Top Books
            </Typography>

            <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                className="ranking-tabs"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Top Daily" />
                <Tab label="Top Weekly" />
                <Tab label="Top Monthly" />
            </Tabs>

            <div className="book-list-container">
                {activeTab === 0 && renderBookList(dailyTop)}
                {activeTab === 1 && renderBookList(weeklyTop)}
                {activeTab === 2 && renderBookList(monthlyTop)}
            </div>
        </div>
    );
};

export default TopBooksPage;