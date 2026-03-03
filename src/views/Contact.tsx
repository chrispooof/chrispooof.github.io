export default function Contact() {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4">Contact</h1>
      <div className="inline-block">
        <p className="text-justify text-black inline-block px-[20vw] my-4 text-lg">
          If you would like to reach out to me for any reason, I would love to hear what you have to say!
          Please feel free to reach out through email:
        </p>
      </div>
      <div className="inline-flex">
        <p className="text-center text-black bg-[rgb(144,181,194)] overflow-auto px-4 py-2">
          <code>
            <b>$ echo Y2hyaXNmZXJuYW5kZXMxOEBnbWFpbC5jb20K | base64 --decode</b>
          </code>
        </p>
      </div>
      <div className="inline-block">
        <p className="text-justify text-black inline-block px-[20vw] my-4 text-lg">
          For other methods of contact, you can reach out with the social media links at the bottom of the page.
        </p>
      </div>
    </div>
  )
}
