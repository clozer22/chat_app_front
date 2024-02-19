import React from 'react'
import CircleLoader from 'react-spinners/CircleLoader'

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
    <div className="absolute inset-0 flex justify-center items-center">
      <CircleLoader
        color="#eee"
        cssOverride={{}}
        loading
        size={50}
        speedMultiplier={1}
      />
    </div>
  </div>
  )
}

export default Loading