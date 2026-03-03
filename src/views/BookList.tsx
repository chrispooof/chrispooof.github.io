import booklist from '../assets/lists/booklist.json'

interface Book {
  Title: string
  Author: string
}

export default function BookList() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Book List</h1>
      <h2 className="text-xl font-semibold mt-4">Read</h2>
      <ul className="list-none text-left inline-block">
        {(booklist.Read as Book[]).map((book) => (
          <li key={book.Title} className="block py-1">
            <b className="text-[rgb(1,122,122)]">{book.Title}</b>
            {` by: ${book.Author}`}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4">Want to Read</h2>
      <ul className="list-none text-left inline-block">
        {(booklist.Want_to_Read as Book[]).map((book) => (
          <li key={book.Title} className="block py-1">
            <b className="text-[rgb(1,122,122)]">{book.Title}</b>
            {` by: ${book.Author}`}
          </li>
        ))}
      </ul>
    </div>
  )
}
