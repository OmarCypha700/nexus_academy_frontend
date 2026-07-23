import axiosInstance from "@/app/lib/axios";

// Triggers a browser file save for a Blob. No blob-download pattern existed anywhere in
// this app before this feature, so this is the one place that logic lives.
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Reads the filename out of a Content-Disposition header (the backend sets this on every
// export/template response) so the saved file matches the server's slugified name instead
// of guessing one client-side.
function filenameFromResponse(response, fallback) {
  const header = response.headers?.["content-disposition"];
  const match = header && /filename="([^"]+)"/.exec(header);
  return match ? match[1] : fallback;
}

async function downloadFromEndpoint(url, fallbackFilename) {
  const response = await axiosInstance.get(url, { responseType: "blob" });
  downloadBlob(response.data, filenameFromResponse(response, fallbackFilename));
}

export async function previewAikenImport(quizId, file, onUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `/quizzes/${quizId}/questions/import/preview/`,
    formData,
    {
      // Unset the shared instance's hardcoded JSON content-type so the browser can set
      // its own multipart/form-data boundary for this one request.
      headers: { "Content-Type": undefined },
      onUploadProgress,
    }
  );
  return response.data;
}

export async function commitAikenImport(quizId, questions) {
  const response = await axiosInstance.post(
    `/quizzes/${quizId}/questions/import/commit/`,
    { questions }
  );
  return response.data;
}

export function exportQuizAiken(quizId) {
  return downloadFromEndpoint(`/quizzes/${quizId}/questions/export/`, "quiz-questions.txt");
}

export function exportCourseAiken(courseId) {
  return downloadFromEndpoint(
    `/courses/${courseId}/questions/export/`,
    "course-questions.txt"
  );
}

export function downloadAikenTemplate() {
  return downloadFromEndpoint("/questions/aiken-template/", "aiken-template.txt");
}

// axios/XHR return error response bodies as a Blob too when the request used
// responseType: 'blob' (export/template calls) — even for a JSON error body like a 403.
// Without this, `err.response?.data?.detail` silently reads as undefined instead of the
// real message.
export async function extractErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.detail || fallback;
    } catch {
      return fallback;
    }
  }
  return data?.detail || fallback;
}
