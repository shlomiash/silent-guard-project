
//Components Import
import CameraCase1 from "./camera-case-1";
import CameraCase2 from "./camera-case-2";
import CameraCase4 from "./camera-case-4";


export default function CameraZone() {

    const numofImages = 3 ;

    return(
        <div className="h-full w-full">
            <CameraCase1 cameraNumber={numofImages}/>
            <CameraCase2 cameraNumber={numofImages}/>
            <CameraCase4 cameraNumber={numofImages}/>
        </div>
        
    )
  }
