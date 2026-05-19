import { ClientInstance } from "./apiClient";
import logger from "../utils/logger";

const normalizeFileUri = (uri?: string) => {
    if (!uri) {
        return "";
    }

    if (
        uri.startsWith("file://") ||
        uri.startsWith("content://") ||
        uri.startsWith("ph://") ||
        uri.startsWith("assets-library://") ||
        uri.startsWith("http://") ||
        uri.startsWith("https://")
    ) {
        return uri;
    }

    return `file://${uri}`;
};

const getFileNameFromUri = (uri?: string, fallback = "upload") => {
    if (!uri) {
        return fallback;
    }

    const sanitizedUri = uri.split("?")[0];
    const fileName = sanitizedUri.split("/").pop();

    return fileName || fallback;
};

export const uploadImage = async (bool: boolean, result: any) => {
    const formData = new FormData();

    if (bool) {
        const fileUri = result;
        const normalizedUri = normalizeFileUri(fileUri);

        if (!normalizedUri) {
            throw new Error("Audio file URI is missing.");
        }

        const fileName = getFileNameFromUri(normalizedUri, "audio.m4a");

        formData.append("audio", {
            uri: normalizedUri,
            type: "audio/mp4",
            name: fileName,
        } as any);
    } else {

        result.forEach((image: any) => {
            const fileUri = normalizeFileUri(image?.path);
            const fileName =
                image?.filename ||
                image?.fileName ||
                getFileNameFromUri(fileUri, `image-${Date.now()}.jpg`);
            return (
                formData.append("images", {
                    uri: fileUri,
                    type: image?.mime || "image/jpeg",
                    name: fileName,
                })
            )
        });
    }

    logger.log('formData', formData);


    try {
        const response = await ClientInstance.post("/chat/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },);

        return response.data;
    } catch (error) {
        logger.log("Upload error:", error);
        throw error;
    }
};
