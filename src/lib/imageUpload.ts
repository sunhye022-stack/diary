import { supabase } from "@/lib/supabase/client";
import { SUPABASE_BUCKET } from "@/lib/supabase/constants";

export interface ImageUploadResponse {
  url: string; // 업로드된 이미지의 공개 URL
  path: string; // Supabase Storage 내 이미지 파일 경로
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImageToSupabase(
  file: File
): Promise<ImageUploadResponse> {
  // 1. 파일이 이미지인지 확인
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드 가능합니다.");
  }

  // 2. 파일 크기 제한 (5MB)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("이미지 크기는 5MB 이하여야 합니다.");
  }

  try {
    // 3. 고유한 파일 이름 생성
    const fileExt = file.name.split(".").pop() ?? "png";
    const filePath = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // 4. Supabase Storage에 업로드
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // 5. 공개 URL 가져오기
    const { data } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  } catch (error) {
    // 6. 에러 처리
    console.error("이미지 업로드 에러:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
}
