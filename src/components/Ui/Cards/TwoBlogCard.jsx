import Link from "next/link";
import ArrowRightIcon from "../Icon/ArrowRight";

const TwoBlogCard = ({ post }) => {
  const formatPreviewContent = (content, maxLength = 150) => {
    if (!content) return "";

    // Remove markdown syntax for preview
    const plainText = content
      .replace(/#{1,6}\s/g, "") // Remove headings
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links but keep text
      .replace(/!\[(.*?)\]$$.*?$$/g, "") // Remove images
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/>\s(.*?)(\n|$)/g, "$1$2") // Remove blockquotes
      .replace(/- (.*?)(\n|$)/g, "$1$2") // Remove list markers
      .replace(/\d+\. (.*?)(\n|$)/g, "$1$2"); // Remove numbered list markers

    // Truncate to maxLength
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

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
        <p>{formatPreviewContent(post?.description)}</p>
        <Link href={post?.link} className="post-read-more">
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
};

export default TwoBlogCard;
