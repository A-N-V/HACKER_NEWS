import React from "react"
import ContentLoader from "react-content-loader"

const SortBtnSkeleton = () => (
  <ContentLoader 
    speed={2}
    width={125}
    height={60}
    viewBox="0 0 125 60"
    backgroundColor="#e1dfdf"
    foregroundColor="#c8ccd0"
  >
    <rect x="0" y="0" rx="10" ry="10" width="125" height="60" />
  </ContentLoader>
)

export default SortBtnSkeleton