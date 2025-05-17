import React from "react";

const NewsItem = ({
  title,
  description,
  imageUrl,
  newsUrl,
  author,
  date,
  source,
}) => {
  return (
    <div className="card my-3">
      <img
        src={
          imageUrl
            ? imageUrl
            : "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i5DYL3E5slvU/v1/1200x800.jpg"
        }
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <span
          title={source.name}
          className=" source-badge position-absolute top-0 translate-middle badge rounded-pill bg-dark"
          style={{
            top: "10px",
            right: "10px",
            zIndex: 1,
            maxWidth: "calc(100% - 20px)", //Make the badge as wide as the card, but leave 10px space on both sides
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {source.name}
        </span>
        <h5 className="card-title">{title}...</h5>
        <p className="card-text">{description}...</p>
        <p className="card-text">
          <small className="text-muted">
            By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}
          </small>
        </p>
        <a
          href={newsUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-dark"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default NewsItem;

// constructor() --> render() --> componentDidMount()

// (if state/props change)
// --> render() --> componentDidUpdate()

// (when component is removed)
// --> componentWillUnmount()
