'use client'

import Image from "next/image";
import { useState } from "react";

export default function CameraCase1({cameraNumber}: {cameraNumber: number}) {

  const handlingCameraClick = (cameraNumber: number) => {
    if(extendedCamera === cameraNumber) {
      setExtandedCamera(null);
    }
    else {
      setExtandedCamera(cameraNumber);
    }

  }

  const [extendedCamera, setExtandedCamera] = useState<number | null>(null);

    if(cameraNumber != 2){
        return;
    }

    return(
        <div className="h-full w-full">
        <div className="flex flex-col h-full w-full space-y-0.5">
          <div className={`${(extendedCamera === 1 || extendedCamera === null)? 'relative flex-1 w-full' : 'hidden' }`}>
            <Image
              src="/pic1.jpg"
              alt="Top Image"
              fill
              className="object-cover rounded-lg border-1 border-gray-800 cursor-pointer"
              onDoubleClick={() => {handlingCameraClick(1)}}
            />
          </div>
          <div className={`${(extendedCamera === 2 || extendedCamera === null)? 'relative flex-1 w-full' : 'hidden' }`}>
            <Image
              src="/pic2.jpg"
              alt="Bottom Image"
              fill
              className="object-cover rounded-lg border-1 border-gray-800 cursor-pointer"
              onDoubleClick={() => {handlingCameraClick(2)}}
            />
          </div>
        </div>
      </div> 
    )
  }

