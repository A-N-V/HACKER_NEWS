import React from "react"
import ContentLoader from "react-content-loader"

const ResetBtnSkeleton = () => (
  <ContentLoader 
    speed={2}
    width={60}
    height={60}
    viewBox="0 0 60 60"
    backgroundColor="#e1dfdf"
    foregroundColor="#c8ccd0"
  >
    <rect x="0" y="0" rx="100" ry="100" width="60" height="60" />
  </ContentLoader>
)

export default ResetBtnSkeleton