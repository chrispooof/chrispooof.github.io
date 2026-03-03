import PhotoGallery from '../components/PhotoGallery'

const costaricaPhotos19 = Object.values(import.meta.glob<string>('../assets/costa_rica/2019/*.jpg', { eager: true, import: 'default' }))
const costaricaPhotos18 = Object.values(import.meta.glob<string>('../assets/costa_rica/2018/*.jpg', { eager: true, import: 'default' }))
const eclipsePhotos = Object.values(import.meta.glob<string>('../assets/eclipse/*.jpg', { eager: true, import: 'default' }))
const japanPhotos = Object.values(import.meta.glob<string>('../assets/japan/*.jpg', { eager: true, import: 'default' }))

export default function Photos() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Photos</h1>
      <h2 className="text-left px-[2vw]">Costa Rica</h2>
      <h3 className="text-left px-[3vw]">July 2019</h3>
      <PhotoGallery photos={costaricaPhotos19} photosId={0} />
      <h3 className="text-left px-[3vw]">December 2018</h3>
      <PhotoGallery photos={costaricaPhotos18} photosId={1} />
      <h2 className="text-left px-[2vw]">Eclipse</h2>
      <h3 className="text-left px-[3vw]">August 2017</h3>
      <PhotoGallery photos={eclipsePhotos} photosId={2} />
      <h2 className="text-left px-[2vw]">Japan</h2>
      <h3 className="text-left px-[3vw]">July 2016</h3>
      <PhotoGallery photos={japanPhotos} photosId={3} />
    </div>
  )
}
