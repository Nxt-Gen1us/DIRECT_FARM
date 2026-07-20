import messageService from '../services/message.service.js';

export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage({ sender: req.user.id, ...req.body });
    res.status(201).json({ status: 'success', data: message });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const messages = await messageService.getConversation(req.params.conversationId, req.query);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }
};

export const getRecentMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getRecentMessages(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const message = await messageService.markRead(req.params.messageId);
    res.status(200).json({ status: 'success', data: message });
  } catch (error) {
    next(error);
  }
};
