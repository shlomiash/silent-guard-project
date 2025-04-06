import Image from "next/image";

export default function CameraCase1({cameraNumber}: {cameraNumber: number}) {

    if(cameraNumber !== 1 && cameraNumber !== 0){
        return;
    }

    return(
        <div className="h-full w-full">
        <div className="flex flex-col h-full w-full space-y-0.5">
          <div className="relative flex-1 w-full">
            {cameraNumber === 0 ?
             <Image
             src="/noCamera.png"
             alt="Top Image"
             fill
             className="object-cover rounded-lg border-1 border-gray-800"
           />
            : <Image
              src="/pic1.jpg"
              alt="Top Image"
              fill
              className="object-cover rounded-lg border-1 border-gray-800"
            />}
            
          </div>
        </div>
      </div> 
    )
  }

