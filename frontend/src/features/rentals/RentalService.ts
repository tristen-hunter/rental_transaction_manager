import axiosClient from "@/context/axiosClient";
import { type RentalCreateDto } from "./RentalCreateDto";
import type { RentalReturnDto } from "./rental";

/// Holds all API end points for Rentals
export const RentalService = {

    /**
     * POST createRental
     *      "/api/v1/rentals"
     */
    create: async (data: RentalCreateDto) => {
        const response = await axiosClient.post<RentalReturnDto> ("/rentals", data);
        console.log(response.data);

        return response.data;
    },

    /**
     * POST create Instance
     * @returns InstanceReturnDto
     */
    createInstance: async (rentalId: string) => {
        const response = await axiosClient.post(`/instances/${rentalId}`);
        // console.log(response.data)
        return response.data;
    },

    /**Fetch all instances for a rental */
    fetchRentalsInstances: async (rentalId: string) => {
        const response = await axiosClient.get(`/rentals/${rentalId}`);
        
        console.log(response.data)
        return response.data;
    }
}