import Link from "next/link"

const TagCard = ({ tags = [] }) => {
  return (
    <div className="widget">
      <h3 className="wp-block-heading">Tags:</h3>
      <div className="wp-block-tag-cloud">
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => (
            <Link key={index} href={`/tag/${tag.toLowerCase()}`}>
              {tag}
            </Link>
          ))
        ) : (
          <>
            <Link href="/tag/health">Health</Link>
            <Link href="/tag/tech">Tech</Link>
            <Link href="/tag/wellness">Wellness</Link>
            <Link href="/tag/ai">AI</Link>
            <Link href="/tag/prevention">Prevention</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default TagCard

