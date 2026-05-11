import Friendship from "../models/Friendship.js"
import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body
    const from = req.user._id

    if (from === to) {
      return res.status(400).json({ message: "Bad Request" })
    }

    const userExists = await User.exists({ _id: to })
    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" })
    }

    let userA = from.toString()
    let userB = to.toString()

    // chuẩn hoá dữ liệu trước khi ghi vào db, db sắp xếp theo thứ tự ID tăng dần, vào Friend.js để xem thêm
    if (userA > userB) {
      [userA, userB] = [userB, userA]
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friendship.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      })
    ])

    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" })
    }

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request has already been sent" })
    }

    const friendRequest = await FriendRequest.create({
      from,
      to,
      message
    })

    return res.status(201).json({ message: "Friend request sent", friendRequest })
  } catch (error) {
    console.log("Error creating friend request", error);
    return res.status(500).json({ message: "System Error" })
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" })
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bad request. Unauthorized" })
    }

    const friendship = await Friendship.create({
      userA: request.from,
      userB: request.to
    })

    await FriendRequest.findByIdAndDelete(requestId)

    const from = await User
      .findById(request.from)
      .select("_id displayName avatarUrl")
      .lean()

    return res.status(200).json({
      message: "Friend request accepted",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl
      }
    })
  } catch (error) {
    console.log("Error accepting friend request", error);
    return res.status(500).json({ message: "System Error" })
  }
}

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bad request. Unauthorized" })
    }

    await FriendRequest.findByIdAndDelete(requestId)

    return res.status(204)
  } catch (error) {
    console.log("Error declining friend request", error);
    return res.status(500).json({ message: "System Error" })
  }
}

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id

    const friendships = await Friendship.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId
        }
      ]
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean()

    if (!friendships.length) {
      return res.status(200).json({ friends: [] })
    }

    const friends = friendships.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA)

    return res.status(200).json({ friendships })
  } catch (error) {
    console.log("Error retrieving friend list", error);
    return res.status(500).json({ message: "System Error" })
  }
}

export const getAllFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id

    const populateFields = "_id username displayName avatarUrl"

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields)
    ])

    res.status(200).json({ sent, received })

  } catch (error) {
    console.log("Error retrieving friend requests", error);
    return res.status(500).json({ message: "System Error" })
  }
}