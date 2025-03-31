import Link from "next/link"

const CategoryCard = ({ categories = [] }) => {
  return (
    <div className="widget">
      <h3 className="wp-block-heading">Categories:</h3>
      <ul>
        {categories && categories.length > 0 ? (
          categories.map((category, index) => (
            <li key={index}>
              <Link href={`/category/${category.toLowerCase()}`}>{category}</Link>
            </li>
          ))
        ) : (
          <>
            <li>
              <Link href="/category/health">Health</Link>
            </li>
            <li>
              <Link href="/category/tech">Tech</Link>
            </li>
            <li>
              <Link href="/category/wellness">Wellness</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default CategoryCard

