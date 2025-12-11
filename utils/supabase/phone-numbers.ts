// import { createClient } from "./client";
// import {
//   PhoneNumber,
//   CreatePhoneNumberData,
//   UpdatePhoneNumberData,
// } from "@/types/phone";

// export class PhoneNumberService {
//   private supabase = createClient();

//   async getPhoneNumbers(
//     orgId: string
//   ): Promise<{ data: PhoneNumber[]; error: any }> {
//     try {
//       const { data, error } = await this.supabase
//         .from("phone_numbers")
//         .select(
//           `
//           *,
//           receptionist:receptionists(id, name)
//         `
//         )
//         .eq("org_id", orgId)
//         .order("created_at", { ascending: false });

//       return { data: data || [], error };
//     } catch (error) {
//       console.error("Error fetching phone numbers:", error);
//       return { data: [], error };
//     }
//   }

//   async getPhoneNumberById(
//     id: string,
//     orgId: string
//   ): Promise<{ data: PhoneNumber | null; error: any }> {
//     try {
//       const { data, error } = await this.supabase
//         .from("phone_numbers")
//         .select(
//           `
//           *,
//           receptionist:receptionists(id, name)
//         `
//         )
//         .eq("id", id)
//         .eq("org_id", orgId)
//         .single();

//       return { data, error };
//     } catch (error) {
//       console.error("Error fetching phone number:", error);
//       return { data: null, error };
//     }
//   }

//   async createPhoneNumber(
//     phoneData: CreatePhoneNumberData,
//     orgId: string
//   ): Promise<{ data: PhoneNumber | null; error: any }> {
//     try {
//       const { data, error } = await this.supabase
//         .from("phone_numbers")
//         .insert([{ ...phoneData, org_id: orgId }])
//         .select()
//         .single();

//       return { data, error };
//     } catch (error) {
//       console.error("Error creating phone number:", error);
//       return { data: null, error };
//     }
//   }

//   async updatePhoneNumber(
//     id: string,
//     updates: UpdatePhoneNumberData,
//     orgId: string
//   ): Promise<{ data: PhoneNumber | null; error: any }> {
//     try {
//       const { data, error } = await this.supabase
//         .from("phone_numbers")
//         .update({ ...updates, updated_at: new Date().toISOString() })
//         .eq("id", id)
//         .eq("org_id", orgId)
//         .select()
//         .single();

//       return { data, error };
//     } catch (error) {
//       console.error("Error updating phone number:", error);
//       return { data: null, error };
//     }
//   }

//   async deletePhoneNumber(id: string, orgId: string): Promise<{ error: any }> {
//     try {
//       // First, check if any receptionist is using this phone number
//       const { data: receptionists } = await this.supabase
//         .from("receptionists")
//         .select("id")
//         .eq("assigned_phone_number_id", id)
//         .eq("org_id", orgId);

//       if (receptionists && receptionists.length > 0) {
//         return {
//           error: new Error(
//             "Cannot delete phone number assigned to receptionists"
//           ),
//         };
//       }

//       const { error } = await this.supabase
//         .from("phone_numbers")
//         .delete()
//         .eq("id", id)
//         .eq("org_id", orgId);

//       return { error };
//     } catch (error) {
//       console.error("Error deleting phone number:", error);
//       return { error };
//     }
//   }

//   async assignToReceptionist(
//     phoneNumberId: string,
//     receptionistId: string | null,
//     orgId: string
//   ): Promise<{ error: any }> {
//     try {
//       // Update the phone number
//       const { error: phoneError } = await this.supabase
//         .from("phone_numbers")
//         .update({
//           receptionist_id: receptionistId,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", phoneNumberId)
//         .eq("org_id", orgId);

//       if (phoneError) return { error: phoneError };

//       // If assigning to a receptionist, update the receptionist as well
//       if (receptionistId) {
//         const { error: receptionistError } = await this.supabase
//           .from("receptionists")
//           .update({ assigned_phone_number_id: phoneNumberId })
//           .eq("id", receptionistId)
//           .eq("org_id", orgId);

//         if (receptionistError) return { error: receptionistError };
//       }

//       return { error: null };
//     } catch (error) {
//       console.error("Error assigning phone number:", error);
//       return { error };
//     }
//   }

//   // async getAvailablePhoneNumbers(
//   //   orgId: string
//   // ): Promise<{ data: PhoneNumber[]; error: any }> {
//   //   try {
//   //     const { data, error } = await this.supabase
//   //       .from("phone_numbers")
//   //       .select("*")
//   //       .eq("org_id", orgId)
//   //       .eq("is_active", true)
//   //       .is("receptionist_id", null)
//   //       .order("created_at", { ascending: false });

//   //     return { data: data || [], error };
//   //   } catch (error) {
//   //     console.error("Error fetching available phone numbers:", error);
//   //     return { data: [], error };
//   //   }
//   // }
//   async getAvailablePhoneNumbers(
//     orgId: string
//   ): Promise<{ data: PhoneNumber[]; error: any }> {
//     try {
//       const { data, error } = await this.supabase
//         .from("phone_numbers")
//         .select("*")
//         .eq("org_id", orgId)
//         .eq("is_active", true)
//         .is("receptionist_id", null) // Only show unassigned numbers
//         .order("created_at", { ascending: false });

//       return { data: data || [], error };
//     } catch (error) {
//       console.error("Error fetching available phone numbers:", error);
//       return { data: [], error };
//     }
//   }
// }

// export const phoneNumberService = new PhoneNumberService();

import { createClient } from "./client";
import {
  PhoneNumber,
  CreatePhoneNumberData,
  UpdatePhoneNumberData,
} from "@/types/phone";

export class PhoneNumberService {
  private supabase = createClient();

  async getPhoneNumbers(
    orgId: string
  ): Promise<{ data: PhoneNumber[]; error: any }> {
    try {
      // Use separate queries to avoid relationship ambiguity
      const { data: phonesData, error } = await this.supabase
        .from("twilionumbers")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (error) {
        return { data: [], error };
      }

      // Fetch receptionist details separately for assigned phones
      const phoneNumbersWithReceptionists = await Promise.all(
        (phonesData || []).map(async (phone) => {
          if (!phone.receptionist_id) {
            return { ...phone, receptionist: null };
          }

          const { data: receptionistData } = await this.supabase
            .from("receptionists")
            .select("id, name")
            .eq("id", phone.receptionist_id)
            .single();

          return {
            ...phone,
            receptionist: receptionistData || null,
          };
        })
      );

      return { data: phoneNumbersWithReceptionists, error: null };
    } catch (error) {
      console.error("Error fetching phone numbers:", error);
      return { data: [], error };
    }
  }

  // async getPhoneNumbers(
  //   orgId: string
  // ): Promise<{ data: PhoneNumber[]; error: any }> {
  //   try {
  //     // Use separate queries to avoid relationship ambiguity
  //     const { data: phonesData, error } = await this.supabase
  //       .from("phone_numbers")
  //       .select("*")
  //       .eq("org_id", orgId)
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       return { data: [], error };
  //     }

  //     // Fetch receptionist details separately for assigned phones
  //     const phoneNumbersWithReceptionists = await Promise.all(
  //       (phonesData || []).map(async (phone) => {
  //         if (!phone.receptionist_id) {
  //           return { ...phone, receptionist: null };
  //         }

  //         const { data: receptionistData } = await this.supabase
  //           .from("receptionists")
  //           .select("id, name")
  //           .eq("id", phone.receptionist_id)
  //           .single();

  //         return {
  //           ...phone,
  //           receptionist: receptionistData || null,
  //         };
  //       })
  //     );

  //     return { data: phoneNumbersWithReceptionists, error: null };
  //   } catch (error) {
  //     console.error("Error fetching phone numbers:", error);
  //     return { data: [], error };
  //   }
  // }

  async getPhoneNumberById(
    id: string,
    orgId: string
  ): Promise<{ data: PhoneNumber | null; error: any }> {
    try {
      // Use separate queries for single phone number too
      const { data: phoneData, error } = await this.supabase
        .from("twilionumbers")

        .select("*")
        .eq("id", id)
        .eq("org_id", orgId)
        .single();

      if (error || !phoneData) {
        return { data: null, error };
      }

      let receptionistData = null;
      if (phoneData.receptionist_id) {
        const { data: receptionist } = await this.supabase
          .from("receptionists")
          .select("id, name")
          .eq("id", phoneData.receptionist_id)
          .single();

        receptionistData = receptionist;
      }

      return {
        data: { ...phoneData, receptionist: receptionistData },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching phone number:", error);
      return { data: null, error };
    }
  }

  async createPhoneNumber(
    phoneData: CreatePhoneNumberData,
    orgId: string
  ): Promise<{ data: PhoneNumber | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("twilionumbers")
        .insert([{ ...phoneData, org_id: orgId }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error creating phone number:", error);
      return { data: null, error };
    }
  }

  async updatePhoneNumber(
    id: string,
    updates: UpdatePhoneNumberData,
    orgId: string
  ): Promise<{ data: PhoneNumber | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("twilionumbers")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("org_id", orgId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating phone number:", error);
      return { data: null, error };
    }
  }

  async deletePhoneNumber(id: string, orgId: string): Promise<{ error: any }> {
    try {
      // First, check if any receptionist is using this phone number
      const { data: receptionists } = await this.supabase
        .from("receptionists")
        .select("id")
        .eq("assigned_phone_number_id", id)
        .eq("org_id", orgId);

      if (receptionists && receptionists.length > 0) {
        return {
          error: new Error(
            "Cannot delete phone number assigned to receptionists"
          ),
        };
      }

      const { error } = await this.supabase
        .from("twilionumbers")
        .delete()
        .eq("id", id)
        .eq("org_id", orgId);

      return { error };
    } catch (error) {
      console.error("Error deleting phone number:", error);
      return { error };
    }
  }

  // async assignToReceptionist(
  //   phoneNumberId: string,
  //   receptionistId: string | null,
  //   orgId: string
  // ): Promise<{ error: any }> {
  //   try {
  //     // Update the phone number
  //     const { error: phoneError } = await this.supabase
  //       .from("phone_numbers")
  //       .update({
  //         receptionist_id: receptionistId,
  //         updated_at: new Date().toISOString(),
  //       })
  //       .eq("id", phoneNumberId)
  //       .eq("org_id", orgId);

  //     if (phoneError) return { error: phoneError };

  //     // If assigning to a receptionist, update the receptionist as well
  //     if (receptionistId) {
  //       const { error: receptionistError } = await this.supabase
  //         .from("receptionists")
  //         .update({ assigned_phone_number_id: phoneNumberId })
  //         .eq("id", receptionistId)
  //         .eq("org_id", orgId);

  //       if (receptionistError) return { error: receptionistError };
  //     }

  //     return { error: null };
  //   } catch (error) {
  //     console.error("Error assigning phone number:", error);
  //     return { error };
  //   }
  // }
  // async assignToReceptionist(
  //   phoneNumberId: string | null,
  //   receptionistId: string | null,
  //   orgId: string
  // ): Promise<{ error: any }> {
  //   try {
  //     console.log("🔧 Starting assignment:", {
  //       phoneNumberId,
  //       receptionistId,
  //       orgId,
  //     });

  //     // If we're assigning a phone number (not unassigning)
  //     if (phoneNumberId) {
  //       // First, unassign this phone number from any other receptionist
  //       const { error: unassignError } = await this.supabase
  //         .from("phone_numbers")
  //         .update({
  //           receptionist_id: null,
  //           updated_at: new Date().toISOString(),
  //         })
  //         .eq("receptionist_id", receptionistId)
  //         .eq("org_id", orgId);

  //       if (unassignError) {
  //         console.error("❌ Unassign error:", unassignError);
  //         return { error: unassignError };
  //       }

  //       // Then assign the phone number to the receptionist
  //       const { error: phoneError } = await this.supabase
  //         .from("phone_numbers")
  //         .update({
  //           receptionist_id: receptionistId,
  //           updated_at: new Date().toISOString(),
  //         })
  //         .eq("id", phoneNumberId)
  //         .eq("org_id", orgId);

  //       if (phoneError) {
  //         console.error("❌ Phone update error:", phoneError);
  //         return { error: phoneError };
  //       }
  //     }

  //     // Update the receptionist's assigned phone number
  //     const { error: receptionistError } = await this.supabase
  //       .from("receptionists")
  //       .update({
  //         assigned_phone_number_id: phoneNumberId,
  //       })
  //       .eq("id", receptionistId)
  //       .eq("org_id", orgId);

  //     if (receptionistError) {
  //       console.error("❌ Receptionist update error:", receptionistError);
  //       return { error: receptionistError };
  //     }

  //     console.log("✅ Assignment completed successfully");
  //     return { error: null };
  //   } catch (error) {
  //     console.error("💥 Error assigning phone number:", error);
  //     return { error };
  //   }
  // }

  async assignToReceptionist(
    phoneNumberId: string | null,
    receptionistId: string | null,
    orgId: string
  ): Promise<{ error: any }> {
    console.log(
      "🚀 ~ PhoneNumberService ~ assignToReceptionist ~ receptionistId:",
      receptionistId
    );
    try {
      console.log("🔧 Starting assignment:", {
        phoneNumberId,
        receptionistId,
        orgId,
      });

      // If we're unassigning (setting to null)
      if (phoneNumberId === null) {
        console.log(
          "🔄 Unassigning phone number from receptionist:",
          receptionistId
        );

        // Find the phone number currently assigned to this receptionist
        const { data: currentlyAssignedPhone } = await this.supabase
          .from("twilionumbers")
          .select("id")
          .eq("receptionist_id", receptionistId)
          .eq("org_id", orgId)
          .single();

        // Unassign the currently assigned phone number
        if (currentlyAssignedPhone) {
          const { error: unassignError } = await this.supabase
            .from("twilionumbers")
            .update({
              receptionist_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentlyAssignedPhone.id)
            .eq("org_id", orgId);

          if (unassignError) {
            console.error("❌ Unassign error:", unassignError);
            return { error: unassignError };
          }
        }

        // Update the receptionist to remove the assigned phone number
        const { error: receptionistError } = await this.supabase
          .from("receptionists")
          .update({
            assigned_phone_number_id: null,
          })
          .eq("id", receptionistId)
          .eq("org_id", orgId);

        if (receptionistError) {
          console.error("❌ Receptionist update error:", receptionistError);
          return { error: receptionistError };
        }

        console.log("✅ Unassignment completed successfully");
        return { error: null };
      }

      // If we're assigning a phone number
      console.log(
        "🔄 Assigning phone number:",
        phoneNumberId,
        "to receptionist:",
        receptionistId
      );

      // First, unassign this phone number from any other receptionist
      const { error: unassignCurrentError } = await this.supabase
        .from("twilionumbers")
        .update({
          receptionist_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", phoneNumberId)
        .eq("org_id", orgId);

      if (unassignCurrentError) {
        console.error("❌ Unassign current error:", unassignCurrentError);
        return { error: unassignCurrentError };
      }

      // Then, unassign any other phone number from this receptionist
      const { error: unassignReceptionistError } = await this.supabase
        .from("twilionumbers")
        .update({
          receptionist_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("receptionist_id", receptionistId)
        .eq("org_id", orgId);

      if (unassignReceptionistError) {
        console.error(
          "❌ Unassign receptionist error:",
          unassignReceptionistError
        );
        return { error: unassignReceptionistError };
      }

      // Now assign the phone number to the receptionist
      const { error: assignError } = await this.supabase
        .from("twilionumbers")
        .update({
          receptionist_id: receptionistId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", phoneNumberId)
        .eq("org_id", orgId);

      if (assignError) {
        console.error("❌ Assign error:", assignError);
        return { error: assignError };
      }

      // Update the receptionist's assigned phone number
      const { error: receptionistUpdateError } = await this.supabase
        .from("receptionists")
        .update({
          assigned_phone_number_id: phoneNumberId,
        })
        .eq("id", receptionistId)
        .eq("org_id", orgId);

      if (receptionistUpdateError) {
        console.error("❌ Receptionist update error:", receptionistUpdateError);
        return { error: receptionistUpdateError };
      }

      console.log("✅ Assignment completed successfully");
      return { error: null };
    } catch (error) {
      console.error("💥 Error in assignToReceptionist:", error);
      return { error };
    }
  }

  // async getAvailablePhoneNumbers(
  //   orgId: string
  // ): Promise<{ data: PhoneNumber[]; error: any }> {
  //   try {
  //     const { data, error } = await this.supabase
  //       .from("phone_numbers")
  //       .select("*")
  //       .eq("org_id", orgId)
  //       .eq("is_active", true)
  //       .is("receptionist_id", null)
  //       .order("created_at", { ascending: false });

  //     return { data: data || [], error };
  //   } catch (error) {
  //     console.error("Error fetching available phone numbers:", error);
  //     return { data: [], error };
  //   }
  // }
  async getAvailablePhoneNumbers(
    orgId: string
  ): Promise<{ data: PhoneNumber[]; error: any }> {
    try {
      console.log("🔍 Fetching available phone numbers for org:", orgId);

      const { data, error } = await this.supabase
        .from("twilionumbers")
        .select("*")
        .eq("org_id", orgId)
        .eq("is_active", true)
        // .is("receptionist_id", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching available phone numbers:", error);
        return { data: [], error };
      }

      console.log("✅ Found available phone numbers:", data?.length || 0);
      return { data: data || [], error: null };
    } catch (error) {
      console.error(
        "💥 Unexpected error fetching available phone numbers:",
        error
      );
      return { data: [], error };
    }
  }

  // New method to get receptionists for assignment dropdown
  async getReceptionistsForAssignment(
    orgId: string
  ): Promise<{ data: any[]; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("receptionists")
        .select("id, name")
        .eq("org_id", orgId)
        .order("name", { ascending: true });

      return { data: data || [], error };
    } catch (error) {
      console.error("Error fetching receptionists:", error);
      return { data: [], error };
    }
  }
}

export const phoneNumberService = new PhoneNumberService();
