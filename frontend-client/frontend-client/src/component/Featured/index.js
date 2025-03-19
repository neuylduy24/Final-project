import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BookCard from "../Card";
import "./style.scss";

const FeaturedBooks = ({ books, navigate }) => (
  <Tabs>
    <TabList>
      <Tab>All</Tab>
      <Tab>History</Tab>
    </TabList>
    <TabPanel>
      <div className="row featured-list">
        {books.map((book) => (
          <BookCard
          key={book.id}
          book={book}
          onClick={() => navigate(`/book/${book.id}`, { state: { name: book.title } })}
        />
        ))}
      </div>
    </TabPanel>
  </Tabs>
);

export default FeaturedBooks;
