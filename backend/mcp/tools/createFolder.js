const definition = {
  name: "create_folder",
  description: "Create a folder for the authenticated user",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      parentFolderId: { type: ["string", "null"] },
    },
    required: ["name"],
  },
};

const handler = async (api, args) => {
  const response = await api.post("/api/folders", {
    name: args.name,
    parentFolderId: args.parentFolderId || null,
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response.data),
      },
    ],
  };
};

export default { definition, handler };
