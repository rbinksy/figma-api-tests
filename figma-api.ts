const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
if (!FIGMA_TOKEN) throw new Error("Please set FIGMA_TOKEN environment variable");
const BASE_URL = "https://api.figma.com";

async function figmaApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
    },
  });
  return response.json();
}

// Types based on Figma API spec
interface User {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

interface FileMeta {
  file: {
    name: string;
    folder_name: string;
    last_touched_at: string;
    creator: User;
    thumbnail_url: string;
    editorType: string;
    version: string;
    role: string;
    link_access: string;
    url: string;
  };
}

interface FileResponse {
  document: Node;
  components: Record<string, Component>;
  componentSets: Record<string, ComponentSet>;
  schemaVersion: number;
  styles: Record<string, Style>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

interface Node {
  id: string;
  name: string;
  type: string;
  children?: Node[];
  [key: string]: unknown;
}

interface Component {
  key: string;
  name: string;
  description: string;
}

interface ComponentSet {
  key: string;
  name: string;
  description: string;
}

interface Style {
  key: string;
  name: string;
  styleType: string;
}

// API Functions
export async function getMe(): Promise<User> {
  return figmaApi<User>("/v1/me");
}

export async function getFileMeta(fileKey: string): Promise<FileMeta> {
  return figmaApi<FileMeta>(`/v1/files/${fileKey}/meta`);
}

export async function getFile(fileKey: string, depth?: number): Promise<FileResponse> {
  const query = depth ? `?depth=${depth}` : "";
  return figmaApi<FileResponse>(`/v1/files/${fileKey}${query}`);
}

export async function getFileNodes(fileKey: string, nodeIds: string[]): Promise<unknown> {
  const ids = nodeIds.join(",");
  return figmaApi(`/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`);
}

export async function getImages(
  fileKey: string,
  nodeIds: string[],
  options?: { scale?: number; format?: "jpg" | "png" | "svg" | "pdf" }
): Promise<{ images: Record<string, string | null> }> {
  const ids = nodeIds.join(",");
  const params = new URLSearchParams({ ids });
  if (options?.scale) params.set("scale", options.scale.toString());
  if (options?.format) params.set("format", options.format);
  return figmaApi(`/v1/images/${fileKey}?${params}`);
}

// Test runner
async function main() {
  const fileKey = "2Wvw7V9ERrDnwFoayq7hic";

  console.log("=== Testing Figma API ===\n");

  console.log("1. GET /v1/me - Current User");
  const me = await getMe();
  console.log(JSON.stringify(me, null, 2));
  console.log();

  console.log("2. GET /v1/files/{file_key}/meta - File Metadata");
  const meta = await getFileMeta(fileKey);
  console.log(JSON.stringify(meta, null, 2));
  console.log();

  console.log("3. GET /v1/files/{file_key}?depth=1 - File Structure");
  const file = await getFile(fileKey, 1);
  console.log(JSON.stringify(file, null, 2));
}

main().catch(console.error);
