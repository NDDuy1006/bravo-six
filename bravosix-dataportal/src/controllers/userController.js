export const authMe = async (req, res) => {
  try {
    const user = req.user
    return res.status(200).json({
      user
    })
  } catch (error) {
    console.error("authMe Error", error)
    return res.status(500).json({ Message: "Something went wrong" })
  }
}