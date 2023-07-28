import React from "react"
import ContentLoader from "react-content-loader"

const NewSkeleton = () => (
  <ContentLoader 
    speed={2}
    width='100%'
    height={70}
    viewBox="0 0 700 70"
    backgroundColor="#e1dfdf"
    foregroundColor="#c8ccd0"
  >
    <rect x="0" y="0" rx="10" ry="10" width="700" height="70" />
  </ContentLoader>
)

export default NewSkeleton;