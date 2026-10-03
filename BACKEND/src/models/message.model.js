import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Deterministic, participant-scoped id: `<smaller-user-id>:<larger-user-id>`.
  // It avoids exposing arbitrary conversation records and supports a new chat
  // before either participant has sent a message.
  conversationId: { type: String, required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  attachments: [{ type: String }],
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
