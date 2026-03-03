import PhotoGallery from '../components/PhotoGallery'

const costaricaPhotos19 = Object.keys(import.meta.glob('../assets/costa_rica/2019/*.jpg'))
const costaricaPhotos18 = Object.keys(import.meta.glob('../assets/costa_rica/2018/*.jpg'))
const eclipsePhotos = Object.keys(import.meta.glob('../assets/eclipse/*.jpg'))
const japanPhotos = Object.keys(import.meta.glob('../assets/japan/*.jpg'))

function toPublicPath(path: string) {
  return path.replace('../', '/src/')
}

export default function Photos() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Photos</h1>
      <h2 className="text-left px-[2vw]">Costa Rica</h2>
      <h3 className="text-left px-[3vw]">July 2019</h3>
      <PhotoGallery photos={costaricaPhotos19.map(toPublicPath)} photosId={0} />
      <h3 className="text-left px-[3vw]">December 2018</h3>
      <PhotoGallery photos={costaricaPhotos18.map(toPublicPath)} photosId={1} />
      <h2 className="text-left px-[2vw]">Eclipse</h2>
      <h3 className="text-left px-[3vw]">August 2017</h3>
      <PhotoGallery photos={eclipsePhotos.map(toPublicPath)} photosId={2} />
      <h2 className="text-left px-[2vw]">Japan</h2>
      <h3 className="text-left px-[3vw]">July 2016</h3>
      <PhotoGallery photos={japanPhotos.map(toPublicPath)} photosId={3} />
    </div>
  )
}
