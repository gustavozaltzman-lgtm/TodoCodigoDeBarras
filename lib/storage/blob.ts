import { put, del } from "@vercel/blob";

export async function uploadFile(file: File, folder: string) {
  const blob = await put(`${folder}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url, size: file.size };
}

export async function deleteFile(url: string) {
  await del(url);
}
