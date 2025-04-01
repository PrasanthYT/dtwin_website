import Link from "next/link";

const TagCard = ({ tags = [] }) => {
  return (
    <div className="widget mb-6">
      <h3 className="wp-block-heading">Tags:</h3>
      <div className="wp-block-tag-cloud pb-4">
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => (
            <Link
              key={index}
              href={`/blog?tag=${tag.toLowerCase()}`}
              className="mb-2"
            >
              {tag}
            </Link>
          ))
        ) : (
          <>
            <Link href="/blog?tag=health" className="mb-2">
              Health
            </Link>
            <Link href="/blog?tag=tech" className="mb-2">
              Tech
            </Link>
            <Link href="/blog?tag=wellness" className="mb-2">
              Wellness
            </Link>
            <Link href="/blog?tag=ai" className="mb-2">
              AI
            </Link>
            <Link href="/blog?tag=prevention" className="mb-2">
              Prevention
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TagCard;
