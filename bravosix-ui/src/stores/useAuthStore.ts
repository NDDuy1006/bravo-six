import { create } from "zustand"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import type { AuthState } from "@/types/store"

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken })
  },

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
      get().setAccessToken(accessToken)

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
  },

  refresh: async () => {
    try {
      set({loading: true})
      const {user, fetchMe, setAccessToken} = get()

      const accessToken = await authService.refresh()
      setAccessToken(accessToken)
      
      if (!user) {
        await fetchMe()
      }
    } catch (error) {
      console.error(error)
      toast.error("Session expires. Try to log in again")
      get().clearState()
    } finally {
      set({loading: false})
    }
  }
}))