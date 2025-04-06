import CameraZone from "./camera-zone";

export default function CameraBounderies() {
  return(
    <div className="pt-15 px-2 pb-2  h-full w-full flex justify-center items-center">
        <div className="h-full w-full bg-transparent rounded-xl border-2 border-gray-800">
          <CameraZone/>
        </div>
  </div> 
  )
}