import CameraGrid from "@/components/dashboard/camera-side/camera-grid";
import { getCategoryCameras } from "@/server/actions/getCategoryCameras";

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  const res = await getCategoryCameras(categoryId);

  if (res.error || !res.cameras) {
    return <div>{res.error || 'Cameras not found'}</div>;
  }

  const cameras = res.cameras;

  return (
    <CameraGrid
      cameras={cameras}
      currentCategory={categoryId}
    />
  );
}