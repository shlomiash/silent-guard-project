import Image from "next/image";

export default function CameraCase1({cameraNumber}: {cameraNumber: number}) {

    if(cameraNumber <= 2){
        return;
    }

    let images = [
        "/pic1.jpg", "/pic2.jpg" , "/profile-avatar.png" , "/silent-guard.png"]
     
    if(cameraNumber == 3){
        images = ["/pic1.jpg", "/pic2.jpg" , "/profile-avatar.png"]
        images.push("/noCamera.png")
    }

    return(
        <div className="h-full w-full">
          <div className="grid grid-cols-2 h-full w-full gap-0.5">
            {images.map((image,index) => (
              <div key={index} className="relative flex-1 w-full">
              <Image
                src={image}
                alt="Top Image"
                fill
                className="object-cover rounded-lg border-1 border-gray-800"
              />
              </div>
              ))}
            </div>
        </div>
    )
  }

