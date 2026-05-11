import fs from "fs";
import FormData from "form-data";

const definition = {
  name: "upload_image",
  description: "Upload an image to a folder",
  inputSchema: {
    type: "object",
    properties: {
      folderId: { type: "string" },
      filePath: { type: "string" },
    },
    required: ["folderId", "filePath"],
  },
};

const handler = async (api, args) => {
  const form = new FormData();
  form.append("folderId", args.folderId);
  form.append("image", fs.createReadStream(args.filePath));

  const response = await api.post("/api/images/upload", form, {
    headers: form.getHeaders(),
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
