import axiosClient from "@/context/axiosClient"
import type { AgentCreateDto } from "./AgentCreateDto"
import type { AgentReturnDto } from "./AgentReturnDto";
import type { AgentIdNameDto } from "./AgentIdNameDto";
import type { RentalReturnDto } from "../rentals/rental";

/// Holds all Agent api end points (calls & dto's)
export const AgentService = {

    /**
     * registers a new Java end point
     *  POST "/api/agents"
     */
    create: async (data: AgentCreateDto) => {
        const response = await axiosClient.post<AgentReturnDto>("/agents", data);
        // console.log(response.data);

        return response.data;
    },

    /**
     * Helper method to get all agents Ids and Fullnames (rental creation dropdown)
     */
    fetchAgentNamesAndIds: async (): Promise<AgentIdNameDto[]> => {
        const { data } = await axiosClient.get<AgentIdNameDto[]>("/agents/all/agentSummary");
        // console.log(data)
        return data;
    },

    /** Fetches all Rentals for an Agent based on their ID */
    fetchAgentsRentals: async (agentId: string): Promise<RentalReturnDto[]> => {
        const { data } = await axiosClient.get(`/rentals/agents/${agentId}`);

        // console.log(data);
        return data;
    }
}