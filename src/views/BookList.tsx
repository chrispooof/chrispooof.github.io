import { useQuery } from '@tanstack/react-query'
import { caller } from '../trpc/caller'

function fixName(name: string) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function BookList() {
  const { data: shelves, isLoading } = useQuery({
    queryKey: ['books.getAll'],
    queryFn: () => caller.books.getAll(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Book List</h1>

      {isLoading && <p>Loading books...</p>}

      {shelves &&
        Object.entries(shelves).map(([shelfName, books]) => (
          <div key={shelfName} className="inline-block text-center mx-[10vw] mb-[10vh] w-full">
            <h2 className="text-xl font-semibold mt-4">{fixName(shelfName)}</h2>
            <ul className="list-none text-left inline-block">
              {books.map((book) => (
                <li key={book.title} className="block py-1">
                  <b className="text-[rgb(1,122,122)]">{book.title}</b>
                  {` by: ${book.author}`}
                  <span className="ml-2 font-bold">{book.avg} / 5.00</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  )
}
