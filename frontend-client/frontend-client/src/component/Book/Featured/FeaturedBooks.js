import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BookCard from "../Card/bookDetailCard";
import "./FeaturedBooks.scss";

const FeaturedBooks = ({ books, navigate }) => (
  <Tabs>
    <TabList>
      <Tab>All</Tab>
      <Tab>Top Day</Tab>
      <Tab>Top Week</Tab>
      <Tab>Top Month</Tab>
    </TabList>
    <TabPanel>
      <div className="row featured-list">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() =>
              navigate(`/${book.bookId}`, { state: { name: book.title } })
            }
          />
        ))}
      </div>
    </TabPanel>
  </Tabs>
);

export default FeaturedBooks;
