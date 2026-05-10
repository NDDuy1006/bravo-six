import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true)
  const {
    accessToken,
    user,
    loading,
    refresh,
    fetchMe
  } = useAuthStore()

  const init = async () => {
    if (!accessToken) {
      await refresh()
    }

    if (accessToken && !user) {
      await fetchMe()
    }

    setStarting(false)
  }
  
  useEffect(() => {
    init()
  }, [])

  if (loading || starting) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/signin"
        replace
      />
    )
  }

  return (
    <Outlet>
      
    </Outlet>
  )
}

export default ProtectedRoute