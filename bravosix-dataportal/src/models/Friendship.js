import mongoose from "mongoose"

const friendshipSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Vấn đề: mối quan hệ có thể 2 chiều. vd: Name add friend với Hoàng và Hoàng add friend với Nam, thì cả 2 mối quan hệ này là 1

// Giải pháp: trước khi lưu dữ liệu friendship mới vào db, chuẩn hoá thứ tự theo ID, ai có ID nhỏ hơn thì là userA, người còn lại là userB

// middleware chuẩn hoá thứ tự
friendshipSchema.pre("save", async function () {
  const a = this.userA.toString()
  const b = this.userB.toString()

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b)
    this.userB = new mongoose.Types.ObjectId(a)
  }

})

// Thêm unique index trên 2 trường userA và userB
friendshipSchema.index({ userA: 1, userB: 1 }, { unique: true })

const Friendship = mongoose.model("Friendship", friendshipSchema)

export default Friendship