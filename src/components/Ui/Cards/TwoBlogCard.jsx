import Link from "next/link";
import ArrowRightIcon from "../Icon/ArrowRight";

const TwoBlogCard = ({ post }) => {
  return (
    <div className="single-post-item two-column">
      <div className="post-thumbnail">
        <img src={post?.image || "/placeholder.svg"} alt="" />
      </div>
      <div className="post-content">
        <div className="post-meta">
          <div className="post-category">
            <Link href={`/category/${post?.category?.toLowerCase()}`}>
              {post?.category}
            </Link>
          </div>
          <div className="post-date">{post?.date}</div>
        </div>
        <Link href={post?.link}>
          <h3 className="entry-title">{post?.title}</h3>
        </Link>
        <p>{post?.description}</p>
        <Link href={post?.link} className="post-read-more">
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );  
};

export default TwoBlogCard;
