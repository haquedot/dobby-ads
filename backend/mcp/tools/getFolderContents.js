const definition = {
  name: "get_folder_contents",
  description: "Get folder details, child folders, and images",
  inputSchema: {
    type: "object",
    properties: {
      folderId: { type: "string" },
    },
    required: ["folderId"],
  },
};

const handler = async (api, args) => {
  const [folderRes, childrenRes, imagesRes] = await Promise.all([
    api.get(`/api/folders/${args.folderId}`),
    api.get(`/api/folders/${args.folderId}/children`),
    api.get(`/api/images/folder/${args.folderId}`),
  ]);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          folder: folderRes.data.data.folder,
          folders: childrenRes.data.data.folders,
          images: imagesRes.data.data.images,
        }),
      },
    ],
  };
};

export default { definition, handler };
