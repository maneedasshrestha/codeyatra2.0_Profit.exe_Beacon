import { api } from "../lib/api";

export interface ResourceResponse {
    id: string;
    title: string;
    description?: string;
    file_url: string;
    file_type: string;
    subject: string;
    semester: number;
    uploaded_by: string;
    download_count: number;
    upvotes_count: number;
    created_at: string;
    uploader?: {
        id: string;
        email: string;
    };
}

export interface GetResourcesParams {
    type?: string;
    subject?: string;
    semester?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export const resourceService = {
    getResources: async (params: GetResourcesParams) => {
        const query = new URLSearchParams();
        if (params.type && params.type !== "All") {
            // Map frontend type to backend type
            const typeMap: Record<string, string> = {
                "Notes": "notes",
                "Past Papers": "past_paper",
                "Lab Report": "notes", // Backend doesn't have lab_report yet, mapping to notes
                "Cheatsheet": "notes",
            };
            query.append("type", typeMap[params.type] || params.type.toLowerCase());
        }
        if (params.subject) query.append("subject", params.subject);
        if (params.semester && params.semester !== "All") {
            query.append("semester", params.semester.replace(/\D/g, ""));
        }
        if (params.search) query.append("search", params.search);
        if (params.sort) query.append("sort", params.sort);
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());

        return api.get(`/api/resources?${query.toString()}`);
    },

    uploadResource: async (formData: FormData) => {
        return api.post("/api/resources", formData, true);
    },

    toggleUpvote: async (id: string) => {
        return api.post(`/api/resources/${id}/upvote`, {});
    },

    deleteResource: async (id: string) => {
        return api.delete(`/api/resources/${id}`);
    },
};
