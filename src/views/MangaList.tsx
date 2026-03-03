import { useQuery } from '@tanstack/react-query'
import { caller } from '../trpc/caller'

export default function MangaList() {
  const { data: myMangaList, isLoading } = useQuery({
    queryKey: ['manga.getMyList'],
    queryFn: () => caller.manga.getMyList(),
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">My Manga List</h1>
      <h4 className="text-sm text-gray-600">Source: myanimelist.net</h4>

      {isLoading && <p>Loading manga list...</p>}

      <div className="inline-block text-center mx-[10vw] mb-[10vh]">
        {myMangaList?.map((book) => {
          const readStr =
            book.publishing_status === 1 && book.total_chapters === 0
              ? `Read ${book.chapters_read} of ? chapters`
              : `Read ${book.chapters_read} of ${book.total_chapters} chapters`
          const volumesStr =
            book.publishing_status === 1 && book.total_volumes === 0
              ? `Read ${book.volumes_read} of ? volumes`
              : `Read ${book.volumes_read} of ${book.total_volumes} volumes`
          const scoreStr = `Score: ${book.score}/10`
          const statusStr =
            book.reading_status === 1
              ? 'Currently reading.'
              : book.reading_status === 2
              ? 'Completed.'
              : 'Plan to read.'

          return (
            <div
              key={book.mal_id}
              className="relative inline-grid text-center font-sans rounded-xl mx-6 mt-12 mb-6 w-[200px] bg-[rgb(252,214,88)] border border-cyan-600"
            >
              <a href={book.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={book.images.jpg.image_url ?? ''}
                  alt="Show Cover"
                  className="block mx-auto mt-2 w-[185px] h-[265px]"
                />
              </a>
              <p className="text-sm mt-1">{book.title}</p>
              <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 active:opacity-100 overflow-y-auto bg-black/80 text-white transition-opacity duration-400 w-[200px]">
                <div className="p-2.5 text-xs inline-block text-center">{statusStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">{readStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">{volumesStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">{scoreStr}</div>
                <div className="p-2.5 text-xs inline-block text-center">
                  <a href={book.url} className="text-white no-underline hover:text-cyan-400">MAL Link</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
