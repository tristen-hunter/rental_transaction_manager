import axiosClient from "@/context/axiosClient";
import type { InstanceUpdateDto } from "./InstanceUpdateDto";

export const InstanceService = {

    updateInstance: async (instanceId: string, data: InstanceUpdateDto): Promise<void> => {
        try {
        // .put() for updating an existing resource
        // console.log(data)
        await axiosClient.put(`/instances/${instanceId}/update`, data);

        } catch (error) {
            // Log it for debugging, then re-throw so the UI can show an error state
            console.error("Service Layer Error: updateInstance failed", error);
            throw error; 
        }
    },

    deleteInstance: async (instanceId: string) => {
        try {
            await axiosClient.delete(`/instances/${instanceId}`);
        } catch (err) {
            console.error("Couldn't delete Instance. ID: ", instanceId);
            throw err;
        }
    }
}