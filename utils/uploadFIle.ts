import axios from "axios";

const getResourceType = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";

  return "raw";
};

export const uploadFile = async (file: File) => {
  const resourceType = getResourceType(file);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "CarePet");

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/dfgw9wvjy/${resourceType}/upload`,
    formData
  );

  return {
    url: res.data.secure_url,
    format: res.data.format,
    resourceType,
  };
};
