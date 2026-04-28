import axiosClient from "@/context/axiosClient";
import type { InstanceUpdateDto } from "./InstanceUpdateDto";

export const InstanceService = {

    updateInstance: async (data: InstanceUpdateDto): Promise<void> => {
        try {
        // .put() for updating an existing resource
        await axiosClient.put("/instances", data);

        } catch (error) {
            // Log it for debugging, then re-throw so the UI can show an error state
            console.error("Service Layer Error: updateInstance failed", error);
            throw error; 
        }
    }
}