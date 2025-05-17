import React, { useState, useEffect, useCallback } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";

const News = (props) => {
  const { country, category, apiKey, pageSize, setProgress, searchQuery } = props;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [noResults, setNoResults] = useState(false);

  const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(category)} - DailyPulse`;
  }, [category]);

  const updateNews = useCallback(async () => {
    setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=1&pageSize=${pageSize}`;
    setLoading(true);
    const data = await fetch(url);
    setProgress(50);
    const parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    setProgress(100);
    setNoResults(false); // reset noResults on category change
  }, [country, category, apiKey, pageSize, setProgress]);

  const searchNews = useCallback(
    async (query) => {
      if (!query) return;
      setLoading(true);
      setNoResults(false); // reset before new search

      const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=1&pageSize=${pageSize}`;
      const data = await fetch(url);
      const parsedData = await data.json();

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);

      if (parsedData.totalResults === 0) {
        setNoResults(true); // show "no results"
      }
    },
    [apiKey, pageSize]
  );

  useEffect(() => {
    setNoResults(false); // ensure reset on any change
    setPage(1);
    if (searchQuery) {
      searchNews(searchQuery); // If there's a search term, search for it
    } else {
      updateNews(); // Otherwise, load category-based news
    }
  }, [searchQuery, category, searchNews, updateNews]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${nextPage}&pageSize=${pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px"}}>
        DailyPulse - Top Headlines
        {searchQuery && (
          <>
            {" for "}
            <span className="text-primary">"{searchQuery}"</span>
          </>
        )}
      </h1>

      {loading && <Spinner />}

      {noResults ? (
        <div className="no-results text-center my-5">
          <h2>No results found for "{searchQuery}"</h2>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length < totalResults}
          loader={<Spinner />}
        >
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
