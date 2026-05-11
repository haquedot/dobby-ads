const normalizePath = (pathValue) => {
  if (!pathValue || pathValue === "/") {
    return "/";
  }
  return pathValue.endsWith("/") ? pathValue.slice(0, -1) : pathValue;
};

export const buildFolderPath = (parentPath, name) => {
  const base = normalizePath(parentPath);
  if (base === "/") {
    return `/${name}`;
  }
  return `${base}/${name}`;
};

export const ensureNoRootName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Folder name is required");
  }
  if (trimmed.includes("/")) {
    throw new Error("Folder name cannot include '/'");
  }
  return trimmed;
};
