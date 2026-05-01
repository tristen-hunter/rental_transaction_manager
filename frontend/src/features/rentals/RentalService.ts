import axiosClient from "@/context/axiosClient";
import { type RentalCreateDto } from "./RentalCreateDto";
import type { RentalReturnDto } from "./rental";
import type { RentalUpdateDto } from "./RentalUpdateDto";

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
        const response = await axiosClient.get(`/rentals/instances/${rentalId}`);
        return response.data;
    },

    updateRental: async (data: RentalUpdateDto): Promise<void> => {
        try {
            await axiosClient.put("/rentals", data);
        }catch (err) {
            console.error("Service layer Error: updateRental failed", err)
            throw err;
        }
    },

    /// How do config objects work?
    deleteRental: async (rentalId: string) => {
        try {
            // console.log(rentalId)
            await axiosClient.delete(`/rentals/${rentalId}`)
        } catch (err) {
            console.error("Couldn't Delete rental. ID: ", rentalId)
            throw err;
        }
    }
}