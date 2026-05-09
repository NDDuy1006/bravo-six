import { create } from "zustand"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import type { AuthState } from "@/types/store"

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({accessToken: null, user: null, loading: false})
  },

  signUp: async (username, password, email, firstName, lastName) => {
    try {

      set({ loading: true })
      await authService.signUp(username, password, email, firstName, lastName)
      

      toast.success("Created your account!")
    } catch (error) {
      console.error(error);
      toast.error("Couldn’t create account")
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true })
      const { accessToken } = await authService.signIn(username, password)
      set({ accessToken })

      await get().fetchMe()
      toast.success("Welcome back to Bravo Six!")
    } catch (error) {
      console.error(error);
      toast.error("Invalid Credentials")
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      get().clearState()
      await authService.signOut()
      toast.success("You have been signed out")
    } catch (error) {
      console.error(error);
      toast.error("Signout error")
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true })
      const user = await authService.fetchMe()

      set({user})
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null })
      toast.error("Authentication error. Try again later.")
    } finally {
      set({ loading: false })
    }
  }
}))