import Link from "next/link";

const CategoryCard = ({ categories = [] }) => {
  return (
    <div className="widget mb-6">
      <h3 className="wp-block-heading">Categories:</h3>
      <ul className="pb-2">
        {categories && categories.length > 0 ? (
          categories.map((category, index) => (
            <li key={index} className="mb-2">
              <Link href={`/blog?category=${category.toLowerCase()}`}>
                {category}
              </Link>
            </li>
          ))
        ) : (
          <>
            <li className="mb-2">
              <Link href="/blog?category=health">Health</Link>
            </li>
            <li className="mb-2">
              <Link href="/blog?category=tech">Tech</Link>
            </li>
            <li className="mb-2">
              <Link href="/blog?category=wellness">Wellness</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default CategoryCard;
